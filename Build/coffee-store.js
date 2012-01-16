var CoffeeStore;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty;
CoffeeStore = (function() {
  function CoffeeStore(options) {
    var a, ad, adapter, indexedDB, localStore, requestFileSystem, websql, xhr;
    if (options == null) {
      options = {};
    }
    this.prefix = options.prefix || "";
    ad = parseInt(options.adapter) || 0;
    if (typeof options.serialize === 'function') {
      this.$serialize = options.serialize;
    }
    if (typeof options.deserialize === 'function') {
      this.$deserialize = options.deserialize;
    }
    a = window;
    indexedDB = 'indexedDB' in a || 'webkitIndexedDB' in a || 'mozIndexedDB' in a;
    requestFileSystem = 'requestFileSystem' in a || 'webkitRequestFileSystem' in a;
    websql = 'openDatabase' in a;
    localStore = 'localStorage' in a;
    xhr = 'XMLHttpRequest' in a;
    adapter = (function() {
      switch (ad) {
        case 0:
          if (indexedDB) {
            return CoffeeStore.Adapters.IndexedDB;
          } else if (openDatabase) {
            return CoffeeStore.Adapters.WebSQL;
          } else if (requestFileSystem) {
            return CoffeeStore.Adapters.FileSystem;
          } else if (xhr) {
            return CoffeeStore.Adapters.XHR;
          } else if (localStorage) {
            return CoffeeStore.Adapters.LocalStorage;
          } else {
            return CoffeeStore.Adapters.Memory;
          }
          break;
        case 1:
          if (!indexedDB) {
            throw "IndexedDB not supported!";
          }
          return CoffeeStore.Adapters.IndexedDB;
        case 2:
          if (!openDatabase) {
            throw "WebSQL not supported!";
          }
          return CoffeeStore.Adapters.WebSQL;
        case 3:
          if (!requestFileSystem) {
            throw "FileSystem not supported!";
          }
          return CoffeeStore.Adapters.FileSystem;
        case 4:
          if (!localStorage) {
            throw "LocalStorage not supported!";
          }
          return CoffeeStore.Adapters.LocalStorage;
        case 5:
          if (!xhr) {
            throw "XHR not supported!";
          }
          return CoffeeStore.Adapters.XHR;
        case 6:
          return CoffeeStore.Adapters.Memory;
        default:
          throw "Adapter not found!";
      }
    })();
    ['get', 'set', 'remove', 'list'].forEach(__bind(function(item) {
      return this[item] = function() {
        var args;
        args = Array.prototype.slice.call(arguments);
        if (this.running) {
          this.chain(item, args);
        } else {
          this.call(item, args);
        }
        return this;
      };
    }, this));
    this.$chain = [];
    this.adapter = new adapter();
    this.adapter.init.call(this, __bind(function(store) {
      this.ready = true;
      if (typeof options.callback === 'function') {
        options.callback(this);
      }
      return this.callChain();
    }, this));
  }
  CoffeeStore.prototype.error = function() {
    return console.error(arguments);
  };
  CoffeeStore.prototype.serialize = function(obj) {
    if (this.$serialize) {
      return this.$serialize(obj);
    }
    return JSON.stringify(obj);
  };
  CoffeeStore.prototype.deserialize = function(json) {
    if (this.$deserialize) {
      return this.$deserialize(obj);
    }
    return JSON.parse(json);
  };
  CoffeeStore.prototype.chain = function(type, args) {
    return this.$chain.push([type, args]);
  };
  CoffeeStore.prototype.callChain = function() {
    var first;
    if (this.$chain.length > 0) {
      first = this.$chain.shift();
      return this.call(first[0], first[1]);
    }
  };
  CoffeeStore.prototype.call = function(type, args) {
    var callback;
    if (!this.ready) {
      return this.chain(type, args);
    } else {
      this.running = true;
      if ((type === 'set' && args.length === 3) || (type === 'list' && args.length === 1) || ((type === 'get' || type === 'remove') && args.length === 2)) {
        callback = args.pop();
      }
      return this.adapter[type].apply(this, args.concat(__bind(function(data) {
        if (typeof callback === 'function') {
          callback(data);
        }
        this.running = false;
        return this.callChain();
      }, this)));
    }
  };
  return CoffeeStore;
})();
CoffeeStore.ADAPTER_BEST = 0;
CoffeeStore.INDEXED_DB = 1;
CoffeeStore.WEB_SQL = 2;
CoffeeStore.FILE_SYSTEM = 3;
CoffeeStore.LOCAL_STORAGE = 4;
CoffeeStore.XHR = 5;
CoffeeStore.MEMORY = 6;
CoffeeStore.Adapters = {};
CoffeeStore.Adapters.LocalStorage = (function() {
  function _Class() {}
  _Class.prototype.init = function(callback) {
    if (this.prefix !== "") {
      this.prefix += "::";
    }
    return callback(this);
  };
  _Class.prototype.get = function(key, callback) {
    var ret;
    try {
      ret = this.deserialize(localStorage.getItem(this.prefix + key.toString()));
    } catch (error) {
      this.error(error);
    }
    return callback(ret || false);
  };
  _Class.prototype.set = function(key, value, callback) {
    var ret;
    try {
      localStorage.setItem(this.prefix + key.toString(), this.serialize(value));
      ret = true;
    } catch (error) {
      this.error(error);
    }
    return callback(ret || false);
  };
  _Class.prototype.list = function(callback) {
    var i, key, ret, _ref;
    ret = [];
    for (i = 0, _ref = localStorage.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      try {
        key = localStorage.key(i);
        if (this.prefix !== "") {
          if (new RegExp("^" + this.prefix).test(key)) {
            ret.push(key.replace(new RegExp("^" + this.prefix), ""));
          }
        } else {
          ret.push(key);
        }
      } catch (error) {
        this.error(error);
      }
    }
    return callback(ret);
  };
  _Class.prototype.remove = function(key, callback) {
    var ret;
    if (localStorage.getItem(this.prefix + key) === null) {
      callback(false);
      return;
    }
    try {
      localStorage.removeItem(this.prefix + key.toString());
      ret = true;
    } catch (error) {
      this.error(error);
    }
    return callback(ret || false);
  };
  return _Class;
})();
CoffeeStore.Adapters.IndexedDB = (function() {
  function _Class() {}
  _Class.prototype.init = function(callback) {
    var a, request;
    this.version = "1.0";
    this.database = 'store';
    a = window;
    a.indexedDB = a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB;
    request = window.indexedDB.open(this.prefix);
    request.onsuccess = __bind(function(e) {
      var setVrequest;
      this.db = e.target.result;
      if (this.version !== this.db.version) {
        setVrequest = this.db.setVersion(this.version);
        setVrequest.onfailure = this.error;
        return setVrequest.onsuccess = __bind(function(e) {
          var store;
          store = this.db.createObjectStore(this.database, {
            keyPath: "key"
          });
          return callback(this);
        }, this);
      } else {
        return callback(this);
      }
    }, this);
    return request.onfailure = this.error;
  };
  _Class.prototype.get = function(key, callback) {
    var request, store, trans;
    trans = this.db.transaction([this.database], 1);
    store = trans.objectStore(this.database);
    request = store.get(key.toString());
    request.onerror = function() {
      return callback(false);
    };
    return request.onsuccess = __bind(function(e) {
      var result;
      result = e.target.result;
      if (result) {
        return callback(this.deserialize(result.value));
      } else {
        return callback(false);
      }
    }, this);
  };
  _Class.prototype.set = function(key, value, callback) {
    var request, store, trans;
    trans = this.db.transaction([this.database], 1);
    store = trans.objectStore(this.database);
    request = store.put({
      key: key.toString(),
      value: this.serialize(value)
    });
    request.onsuccess = function() {
      return callback(true);
    };
    return request.onerror = this.error;
  };
  _Class.prototype.list = function(callback) {
    var cursorRequest, ret, store, trans;
    trans = this.db.transaction([this.database], 1);
    store = trans.objectStore(this.database);
    cursorRequest = store.openCursor();
    cursorRequest.onerror = this.error;
    ret = [];
    return cursorRequest.onsuccess = __bind(function(e) {
      var result;
      result = e.target.result;
      if (result) {
        ret.push(result.value.key);
        return result["continue"]();
      } else {
        return callback(ret);
      }
    }, this);
  };
  _Class.prototype.remove = function(key, callback) {
    var r, store, trans;
    trans = this.db.transaction([this.database], 1);
    store = trans.objectStore(this.database);
    r = store.get(key.toString());
    r.onerror = function() {
      return callback(false);
    };
    return r.onsuccess = __bind(function(e) {
      var result;
      result = e.target.result;
      if (result) {
        r = store["delete"](key.toString());
        r.onsuccess = function() {
          return callback(true);
        };
        return r.onerror = function() {
          return callback(false);
        };
      } else {
        return callback(false);
      }
    }, this);
  };
  return _Class;
})();
CoffeeStore.Adapters.WebSQL = (function() {
  function _Class() {}
  _Class.prototype.init = function(callback) {
    this.exec = function(statement, callback, args) {
      if (callback == null) {
        callback = (function() {});
      }
      return this.db.transaction(__bind(function(tr) {
        return tr.executeSql(statement, args, callback, __bind(function(tr, err) {
          return callback(false);
        }, this), function() {
          return callback(false);
        });
      }, this));
    };
    this.db = openDatabase(this.prefix, '1.0', 'Store', 5 * 1024 * 1024);
    return this.exec("CREATE TABLE IF NOT EXISTS store ( 'key' VARCHAR PRIMARY KEY NOT NULL, 'value' TEXT)", __bind(function() {
      return callback(this);
    }, this));
  };
  _Class.prototype.get = function(key, callback) {
    return this.exec("SELECT * FROM store WHERE key = '" + key + "'", __bind(function(tr, result) {
      var ret;
      if (result.rows.length > 0) {
        ret = this.deserialize(result.rows.item(0).value);
      } else {
        ret = false;
      }
      return callback.call(this, ret);
    }, this));
  };
  _Class.prototype.set = function(key, value, callback) {
    return this.exec("SELECT * FROM store WHERE key = '" + key + "'", __bind(function(tr, result) {
      if (!(result.rows.length > 0)) {
        return this.exec("INSERT INTO store (key, value) VALUES ('" + key + "','" + (this.serialize(value)) + "')", __bind(function(tr, result) {
          if (result.rowsAffected === 1) {
            return callback(true);
          } else {
            return callback(false);
          }
        }, this));
      } else {
        return this.exec("UPDATE store SET value = '" + (this.serialize(value)) + "' WHERE key = '" + key + "'", __bind(function(tr, result) {
          if (result.rowsAffected === 1) {
            return callback(true);
          } else {
            return callback(false);
          }
        }, this));
      }
    }, this));
  };
  _Class.prototype.list = function(callback) {
    return this.exec("SELECT key FROM store", __bind(function(tr, results) {
      var keys, _i, _ref, _results;
      keys = [];
      if (results.rows.length > 0) {
        (function() {
          _results = [];
          for (var _i = 0, _ref = results.rows.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).forEach(function(i) {
          return keys.push(results.rows.item(i).key);
        });
      }
      return callback(keys);
    }, this));
  };
  _Class.prototype.remove = function(key, callback) {
    return this.exec("DELETE FROM store WHERE key = '" + key + "'", __bind(function(tr, result) {
      if (result.rowsAffected === 1) {
        return callback(true);
      } else {
        return callback(false);
      }
    }, this));
  };
  return _Class;
})();
CoffeeStore.Adapters.XHR = (function() {
  function _Class() {}
  _Class.prototype.init = function(callback) {
    this.request = new Request.JSON({
      url: this.prefix
    });
    this.request.addEvent('success', __bind(function(obj) {
      var r;
      r = this.type === 'get' ? this.deserialize(obj) : obj;
      return this.callback(r);
    }, this));
    this.request.addEvent('failure', __bind(function() {
      return this.callback(false);
    }, this));
    return callback(this);
  };
  _Class.prototype.get = function(key, callback) {
    this.type = 'get';
    this.request.get({
      key: key
    });
    return this.callback = callback;
  };
  _Class.prototype.set = function(key, value, callback) {
    this.type = 'set';
    this.request.post({
      key: key,
      value: this.serialize(value)
    });
    return this.callback = callback;
  };
  _Class.prototype.list = function(callback) {
    this.type = 'list';
    this.request.get();
    return this.callback = callback;
  };
  _Class.prototype.remove = function(key, callback) {
    this.type = 'remove';
    this.request["delete"]({
      key: key
    });
    return this.callback = callback;
  };
  return _Class;
})();
CoffeeStore.Adapters.FileSystem = (function() {
  function _Class() {}
  _Class.prototype.init = function(callback) {
    var rfs;
    rfs = window.RequestFileSystem || window.webkitRequestFileSystem;
    return rfs(window.PRESISTENT, 50 * 1024 * 1024, __bind(function(store) {
      this.storage = store;
      return callback(this);
    }, this), this.error);
  };
  _Class.prototype.list = function(callback) {
    var dirReader, entries, readEntries;
    dirReader = this.storage.root.createReader();
    entries = [];
    readEntries = __bind(function() {
      return dirReader.readEntries(function(results) {
        if (!results.length) {
          entries.sort();
          return callback(entries.map(function(item) {
            return item.name;
          }));
        } else {
          entries = entries.concat(Array.from(results));
          return readEntries();
        }
      }, this.error);
    }, this);
    return readEntries();
  };
  _Class.prototype.remove = function(file, callback) {
    return this.storage.root.getFile(file, null, __bind(function(fe) {
      return fe.remove(function() {
        return callback(true);
      }, function() {
        return callback(false);
      });
    }, this), function() {
      return callback(false);
    });
  };
  _Class.prototype.get = function(file, callback) {
    return this.storage.root.getFile(file, null, __bind(function(fe) {
      return fe.file(__bind(function(f) {
        var reader;
        reader = new FileReader();
        reader.onloadend = __bind(function(e) {
          return callback(this.deserialize(e.target.result));
        }, this);
        return reader.readAsText(f);
      }, this), function() {
        return callback(false);
      });
    }, this), function() {
      return callback(false);
    });
  };
  _Class.prototype.set = function(file, data, callback) {
    if (callback == null) {
      callback = function() {};
    }
    return this.storage.root.getFile(file, {
      create: true
    }, __bind(function(fe) {
      return fe.createWriter(__bind(function(fileWriter) {
        var bb;
        fileWriter.onwriteend = __bind(function(e) {
          return callback(true);
        }, this);
        fileWriter.onerror = __bind(function(e) {
          return callback(false);
        }, this);
        bb = new (window.WebKitBlobBuilder || BlobBuilder());
        bb.append(this.serialize(data));
        return fileWriter.write(bb.getBlob('text/plain'));
      }, this), function() {
        return callback(false);
      });
    }, this), function() {
      return callback(false);
    });
  };
  return _Class;
})();
CoffeeStore.Adapters.Memory = (function() {
  function _Class() {}
  _Class.prototype.init = function(callback) {
    this.store = {};
    return callback(this);
  };
  _Class.prototype.get = function(key, callback) {
    var a, ret;
    if ((a = this.store[key.toString()])) {
      ret = this.deserialize(a);
    } else {
      ret = false;
    }
    return callback(ret);
  };
  _Class.prototype.set = function(key, value, callback) {
    var ret;
    try {
      this.store[key.toString()] = this.serialize(value);
      ret = true;
    } catch (error) {
      this.error(error);
    }
    return callback(ret || false);
  };
  _Class.prototype.list = function(callback) {
    var key, ret;
    ret = [];
    try {
      ret = (function() {
        var _ref, _results;
        _ref = this.store;
        _results = [];
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          _results.push(key);
        }
        return _results;
      }).call(this);
    } catch (error) {
      this.error(error);
    }
    return callback(ret);
  };
  _Class.prototype.remove = function(key, callback) {
    var ret;
    if (this.store[key.toString()] === void 0) {
      callback(false);
      return;
    }
    try {
      delete this.store[key.toString()];
      ret = true;
    } catch (error) {
      this.error(error);
    }
    return callback(ret || false);
  };
  return _Class;
})();