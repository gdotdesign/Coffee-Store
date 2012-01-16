var CoffeeStore,__bind=function(a,b){return function(){return a.apply(b,arguments)}},__hasProp=Object.prototype.hasOwnProperty;CoffeeStore=function(){function a(b){var c,d,e,f,g,h,i,j;b==null&&(b={}),this.prefix=b.prefix||"",d=parseInt(b.adapter)||0,typeof b.serialize=="function"&&(this.$serialize=b.serialize),typeof b.deserialize=="function"&&(this.$deserialize=b.deserialize),c=window,f="indexedDB"in c||"webkitIndexedDB"in c||"mozIndexedDB"in c,h="requestFileSystem"in c||"webkitRequestFileSystem"in c,i="openDatabase"in c,g="localStorage"in c,j="XMLHttpRequest"in c,e=function(){switch(d){case 0:return f?a.Adapters.IndexedDB:openDatabase?a.Adapters.WebSQL:h?a.Adapters.FileSystem:j?a.Adapters.XHR:localStorage?a.Adapters.LocalStorage:a.Adapters.Memory;case 1:if(!f)throw"IndexedDB not supported!";return a.Adapters.IndexedDB;case 2:if(!openDatabase)throw"WebSQL not supported!";return a.Adapters.WebSQL;case 3:if(!h)throw"FileSystem not supported!";return a.Adapters.FileSystem;case 4:if(!localStorage)throw"LocalStorage not supported!";return a.Adapters.LocalStorage;case 5:if(!j)throw"XHR not supported!";return a.Adapters.XHR;case 6:return a.Adapters.Memory;default:throw"Adapter not found!"}}(),["get","set","remove","list"].forEach(__bind(function(a){return this[a]=function(){var b;return b=Array.prototype.slice.call(arguments),this.running?this.chain(a,b):this.call(a,b),this}},this)),this.$chain=[],this.adapter=new e,this.adapter.init.call(this,__bind(function(a){return this.ready=!0,typeof b.callback=="function"&&b.callback(this),this.callChain()},this))}return a.prototype.error=function(){return console.error(arguments)},a.prototype.serialize=function(a){return this.$serialize?this.$serialize(a):JSON.stringify(a)},a.prototype.deserialize=function(a){return this.$deserialize?this.$deserialize(obj):JSON.parse(a)},a.prototype.chain=function(a,b){return this.$chain.push([a,b])},a.prototype.callChain=function(){var a;if(this.$chain.length>0)return a=this.$chain.shift(),this.call(a[0],a[1])},a.prototype.call=function(a,b){var c;if(!this.ready)return this.chain(a,b);this.running=!0;if(a==="set"&&b.length===3||a==="list"&&b.length===1||(a==="get"||a==="remove")&&b.length===2)c=b.pop();return this.adapter[a].apply(this,b.concat(__bind(function(a){return typeof c=="function"&&c(a),this.running=!1,this.callChain()},this)))},a}(),CoffeeStore.ADAPTER_BEST=0,CoffeeStore.INDEXED_DB=1,CoffeeStore.WEB_SQL=2,CoffeeStore.FILE_SYSTEM=3,CoffeeStore.LOCAL_STORAGE=4,CoffeeStore.XHR=5,CoffeeStore.MEMORY=6,CoffeeStore.Adapters={},CoffeeStore.Adapters.LocalStorage=function(){function a(){}return a.prototype.init=function(a){return this.prefix!==""&&(this.prefix+="::"),a(this)},a.prototype.get=function(a,b){var c;try{c=this.deserialize(localStorage.getItem(this.prefix+a.toString()))}catch(d){this.error(d)}return b(c||!1)},a.prototype.set=function(a,b,c){var d;try{localStorage.setItem(this.prefix+a.toString(),this.serialize(b)),d=!0}catch(e){this.error(e)}return c(d||!1)},a.prototype.list=function(a){var b,c,d,e;d=[];for(b=0,e=localStorage.length-1;0<=e?b<=e:b>=e;0<=e?b++:b--)try{c=localStorage.key(b),this.prefix!==""?(new RegExp("^"+this.prefix)).test(c)&&d.push(c.replace(new RegExp("^"+this.prefix),"")):d.push(c)}catch(f){this.error(f)}return a(d)},a.prototype.remove=function(a,b){var c;if(localStorage.getItem(this.prefix+a)===null){b(!1);return}try{localStorage.removeItem(this.prefix+a.toString()),c=!0}catch(d){this.error(d)}return b(c||!1)},a}(),CoffeeStore.Adapters.IndexedDB=function(){function a(){}return a.prototype.init=function(a){var b,c;return this.version="1.0",this.database="store",b=window,b.indexedDB=b.indexedDB||b.webkitIndexedDB||b.mozIndexedDB,c=window.indexedDB.open(this.prefix),c.onsuccess=__bind(function(b){var c;return this.db=b.target.result,this.version!==this.db.version?(c=this.db.setVersion(this.version),c.onfailure=this.error,c.onsuccess=__bind(function(b){var c;return c=this.db.createObjectStore(this.database,{keyPath:"key"}),a(this)},this)):a(this)},this),c.onfailure=this.error},a.prototype.get=function(a,b){var c,d,e;return e=this.db.transaction([this.database],1),d=e.objectStore(this.database),c=d.get(a.toString()),c.onerror=function(){return b(!1)},c.onsuccess=__bind(function(a){var c;return c=a.target.result,c?b(this.deserialize(c.value)):b(!1)},this)},a.prototype.set=function(a,b,c){var d,e,f;return f=this.db.transaction([this.database],1),e=f.objectStore(this.database),d=e.put({key:a.toString(),value:this.serialize(b)}),d.onsuccess=function(){return c(!0)},d.onerror=this.error},a.prototype.list=function(a){var b,c,d,e;return e=this.db.transaction([this.database],1),d=e.objectStore(this.database),b=d.openCursor(),b.onerror=this.error,c=[],b.onsuccess=__bind(function(b){var d;return d=b.target.result,d?(c.push(d.value.key),d["continue"]()):a(c)},this)},a.prototype.remove=function(a,b){var c,d,e;return e=this.db.transaction([this.database],1),d=e.objectStore(this.database),c=d.get(a.toString()),c.onerror=function(){return b(!1)},c.onsuccess=__bind(function(e){var f;return f=e.target.result,f?(c=d["delete"](a.toString()),c.onsuccess=function(){return b(!0)},c.onerror=function(){return b(!1)}):b(!1)},this)},a}(),CoffeeStore.Adapters.WebSQL=function(){function a(){}return a.prototype.init=function(a){return this.exec=function(a,b,c){return b==null&&(b=function(){}),this.db.transaction(__bind(function(d){return d.executeSql(a,c,b,__bind(function(a,c){return b(!1)},this),function(){return b(!1)})},this))},this.db=openDatabase(this.prefix,"1.0","Store",5242880),this.exec("CREATE TABLE IF NOT EXISTS store ( 'key' VARCHAR PRIMARY KEY NOT NULL, 'value' TEXT)",__bind(function(){return a(this)},this))},a.prototype.get=function(a,b){return this.exec("SELECT * FROM store WHERE key = '"+a+"'",__bind(function(a,c){var d;return c.rows.length>0?d=this.deserialize(c.rows.item(0).value):d=!1,b.call(this,d)},this))},a.prototype.set=function(a,b,c){return this.exec("SELECT * FROM store WHERE key = '"+a+"'",__bind(function(d,e){return e.rows.length>0?this.exec("UPDATE store SET value = '"+this.serialize(b)+"' WHERE key = '"+a+"'",__bind(function(a,b){return b.rowsAffected===1?c(!0):c(!1)},this)):this.exec("INSERT INTO store (key, value) VALUES ('"+a+"','"+this.serialize(b)+"')",__bind(function(a,b){return b.rowsAffected===1?c(!0):c(!1)},this))},this))},a.prototype.list=function(a){return this.exec("SELECT key FROM store",__bind(function(b,c){var d,e,f,g;return d=[],c.rows.length>0&&function(){g=[];for(var a=0,b=c.rows.length-1;0<=b?a<=b:a>=b;0<=b?a++:a--)g.push(a);return g}.apply(this).forEach(function(a){return d.push(c.rows.item(a).key)}),a(d)},this))},a.prototype.remove=function(a,b){return this.exec("DELETE FROM store WHERE key = '"+a+"'",__bind(function(a,c){return c.rowsAffected===1?b(!0):b(!1)},this))},a}(),CoffeeStore.Adapters.XHR=function(){function a(){}return a.prototype.init=function(a){return this.request=new Request.JSON({url:this.prefix}),this.request.addEvent("success",__bind(function(a){var b;return b=this.type==="get"?this.deserialize(a):a,this.callback(b)},this)),this.request.addEvent("failure",__bind(function(){return this.callback(!1)},this)),a(this)},a.prototype.get=function(a,b){return this.type="get",this.request.get({key:a}),this.callback=b},a.prototype.set=function(a,b,c){return this.type="set",this.request.post({key:a,value:this.serialize(b)}),this.callback=c},a.prototype.list=function(a){return this.type="list",this.request.get(),this.callback=a},a.prototype.remove=function(a,b){return this.type="remove",this.request["delete"]({key:a}),this.callback=b},a}(),CoffeeStore.Adapters.FileSystem=function(){function a(){}return a.prototype.init=function(a){var b;return b=window.RequestFileSystem||window.webkitRequestFileSystem,b(window.PRESISTENT,52428800,__bind(function(b){return this.storage=b,a(this)},this),this.error)},a.prototype.list=function(a){var b,c,d;return b=this.storage.root.createReader(),c=[],d=__bind(function(){return b.readEntries(function(b){return b.length?(c=c.concat(Array.from(b)),d()):(c.sort(),a(c.map(function(a){return a.name})))},this.error)},this),d()},a.prototype.remove=function(a,b){return this.storage.root.getFile(a,null,__bind(function(a){return a.remove(function(){return b(!0)},function(){return b(!1)})},this),function(){return b(!1)})},a.prototype.get=function(a,b){return this.storage.root.getFile(a,null,__bind(function(a){return a.file(__bind(function(a){var c;return c=new FileReader,c.onloadend=__bind(function(a){return b(this.deserialize(a.target.result))},this),c.readAsText(a)},this),function(){return b(!1)})},this),function(){return b(!1)})},a.prototype.set=function(a,b,c){return c==null&&(c=function(){}),this.storage.root.getFile(a,{create:!0},__bind(function(a){return a.createWriter(__bind(function(a){var d;return a.onwriteend=__bind(function(a){return c(!0)},this),a.onerror=__bind(function(a){return c(!1)},this),d=new(window.WebKitBlobBuilder||BlobBuilder()),d.append(this.serialize(b)),a.write(d.getBlob("text/plain"))},this),function(){return c(!1)})},this),function(){return c(!1)})},a}(),CoffeeStore.Adapters.Memory=function(){function a(){}return a.prototype.init=function(a){return this.store={},a(this)},a.prototype.get=function(a,b){var c,d;return(c=this.store[a.toString()])?d=this.deserialize(c):d=!1,b(d)},a.prototype.set=function(a,b,c){var d;try{this.store[a.toString()]=this.serialize(b),d=!0}catch(e){this.error(e)}return c(d||!1)},a.prototype.list=function(a){var b,c;c=[];try{c=function(){var a,c;a=this.store,c=[];for(b in a){if(!__hasProp.call(a,b))continue;c.push(b)}return c}.call(this)}catch(d){this.error(d)}return a(c)},a.prototype.remove=function(a,b){var c;if(this.store[a.toString()]===void 0){b(!1);return}try{delete this.store[a.toString()],c=!0}catch(d){this.error(d)}return b(c||!1)},a}()