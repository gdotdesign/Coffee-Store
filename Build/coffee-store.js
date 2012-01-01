var Store;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Store = (function() {
  Store.prototype.ADAPTER_BEST = 0;
  Store.prototype.INDEXED_DB = 1;
  Store.prototype.WEB_SQL = 2;
  Store.prototype.FILE_SYSTEM = 3;
  Store.prototype.LOCAL_STORAGE = 4;
  Store.prototype.XHR = 5;
  function Store(options) {
    var a, ad, adapter, indexedDB, item, localStore, prefix, requestFileSystem, websql, xhr, _i, _len, _ref;
    prefix = options.prefix || "";
    ad = parseInt(options.adapter) || this.ADAPTER_BEST;
    a = window;
    indexedDB = 'indexedDB' in a || 'webkitIndexedDB' in a || 'mozIndexedDB' in a;
    requestFileSystem = 'requestFileSystem' in a || 'webkitRequestFileSystem' in a;
    websql = 'openDatabase' in a;
    localStore = 'localStorage' in a;
    xhr = 'XMLHttpRequest' in a;
    switch (ad) {
      case 0:
        if (indexedDB) {
          adapter = Store.Adapters.IndexedDB;
        } else if (openDatabase) {
          adapter = Store.Adapters.WebSQL;
        } else if (requestFileSystem) {
          adapter = Store.Adapters.FileSystem;
        } else if (xhr) {
          adapter = Store.Adapters.XHR;
        } else if (localStorage) {
          adapter = Store.Adapters.LocalStorage;
        } else {
          throw "No supported adapters are found.";
        }
        break;
      case 1:
        if (!indexedDB) {
          throw "IndexedDB not supported";
        }
        adapter = Store.Adapters.WebSQL;
        break;
      case 2:
        if (!openDatabase) {
          throw "WebSQL not supported";
        }
        adapter = Store.Adapters.WebSQL;
        break;
      case 3:
        if (!requestFileSystem) {
          throw "FileSystem not supported";
        }
        adapter = Store.Adapters.FileSystem;
        break;
      case 4:
        if (!localStorage) {
          throw "LocalStorage not supported";
        }
        adapter = Store.Adapters.LocalStorage;
        break;
      case 5:
        if (!xhr) {
          throw "Xhr not supported";
        }
        adapter = Store.Adapters.XHR;
        break;
      default:
        throw "Adapter not found";
    }
    _ref = ['get', 'set', 'remove', 'list'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      this[item] = function() {
        return this.call(item, Array.slice(arguments));
      };
    }
    new Store.Adapters.LocalStorage(prefix, __bind(function(store) {
      this.adapter = store;
      this.ready = true;
      if (typeof options.callback === 'function') {
        options.callback(this);
      }
      return this.callChain();
    }, this));
  }
  Store.prototype.serialize = function(obj) {
    return JSON.stringify(obj);
  };
  Store.prototype.deserialize = function(json) {
    return JSON.parse(json);
  };
  Store.prototype.chain = function(type, arguments) {
    return this.chain.push([type, arguments]);
  };
  Store.prototype.callChain = function() {
    var first;
    if (this.chain.length > 0) {
      first = this.chain.shift();
      return this.call(first[0], first[1]);
    }
  };
  Store.prototype.call = function(type, args) {
    var callback;
    if (!this.ready) {
      return this.chain(type, args);
    } else {
      if (type === 'set') {
        if (args.length === 3) {
          callback = args.pop();
        }
      } else {
        if (args.length === 2) {
          callback = args.pop();
        }
      }
      return this.adapter[type].call(this, args.concat(__bind(function(data) {
        if (typeof callback === 'function') {
          callback(data);
        }
        return this.callChain();
      }, this)));
    }
  };
  return Store;
})();
Store.Adapters.LocalStorage = (function() {
  function _Class(prefix, callback) {
    this.prefix = prefix + "::";
    callback(this);
  }
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
      ret = localStorage.setItem(this.prefix + key.toString(), this.serialize(value));
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
        if ((key = localStorage.key(i)).test(new RegExp("^" + this.prefix))) {
          ret.push(key.replace(new RegExp("^" + this.prefix), ""));
        }
      } catch (error) {
        this.error(error);
      }
    }
    return callback(ret);
  };
  _Class.prototype.remove = function(key, callback) {
    var ret;
    try {
      ret = localStorage.removeItem(this.prefix + key.toString());
    } catch (error) {
      this.error(error);
    }
    return callback(ret || false);
  };
  return _Class;
})();