define 'Store.Adapters.Abstract', "Store.Adapters.IndexedDB", ->
  class IndexedDBStorageAdapter extends Store.Adapters.Abstract
    error: ->
    constructor: (prefix,callback) ->
      @version = "0.2"
      @database = 'store'
      a = window
      a.indexedDB = a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB
      request = window.indexedDB.open(prefix)
      request.onsuccess = (e) =>
        @db = e.target.result
        if typeof callback is 'function' then callback.call @
        unless @version is @db.version
          setVrequest = @db.setVersion(@version)
          setVrequest.onfailure = @error
          setVrequest.onsuccess = (e) =>
            store = @db.createObjectStore(@database, keyPath: "key")
      request.onfailure = @error
      
    get: (key, callback) ->
      IDBTransaction = IDBTransaction || webkitIDBTransaction
      IDBKeyRange = IDBKeyRange || webkitIDBKeyRange
      trans = @db.transaction([@database], IDBTransaction.READ_WRITE)
      store = trans.objectStore(@database)
      keyRange = IDBKeyRange.only key.toString()
      cursorRequest = store.openCursor(keyRange)
      cursorRequest.onerror = @error
      cursorRequest.onsuccess = (e) =>
        result = e.target.result
        if result
          if typeof callback is 'function' then callback.call @, @deserialize result.value.value
        else
          if typeof callback is 'function' then callback.call @, false
    set: (key, value, callback) ->
      trans = @db.transaction([@database], 1)
      store = trans.objectStore(@database)
      request = store.put(
        key: key.toString()
        value: @serialize value
      )
      request.onsuccess = callback
      request.onerror = @error
    list: (callback) ->
      IDBTransaction = IDBTransaction || webkitIDBTransaction
      trans = @db.transaction([@database], IDBTransaction.READ_WRITE)
      store = trans.objectStore(@database)
      cursorRequest = store.openCursor()
      cursorRequest.onerror = @error
      ret = []
      cursorRequest.onsuccess = (e) =>
        result = e.target.result
        if result 
          ret.push result.value.key
          result.continue()
        else
          if typeof callback is 'function' then callback.call @,  ret
    remove: (key, callback) ->
      IDBTransaction = IDBTransaction || webkitIDBTransaction
      trans = @db.transaction([@database], IDBTransaction.READ_WRITE)
      store = trans.objectStore(@database)  
      r = store.delete key.toString() 
      r.onsuccess = -> 
        if typeof callback is 'function' then callback.call @
