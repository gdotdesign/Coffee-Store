define null, "Store", ->
  class Store
    ADAPTER_BEST: 0
    INDEXED_DB: 1
    WEB_SQL: 2
    FILE_SYSTEM: 3
    XHR: 4
    LOCAL_STORAGE: 5
    constructor: (options)->
      prefix = options.prefix || ""
      ad = parseInt(options.adapter) || @ADAPTER_BEST
      callback = if typeof options.callback is 'function' then callback else null
      a = window
      indexedDB = 'indexedDB' of a || 'webkitIndexedDB' of a || 'mozIndexedDB' of a
      requestFileSystem = 'requestFileSystem' of a || 'webkitRequestFileSystem' of a
      websql = 'openDatabase' of a
      localStore = 'localStorage' of a
      xhr = 'XMLHttpRequest' of a
      switch ad
        when 0
          if indexedDB
            adapter = Store.Adapters.IndexedDB
          else if openDatabase
            adapter = Store.Adapters.WebSQL
          else if requestFileSystem
            adapter = Store.Adapters.FileSystem
          else if xhr
            adapter = Store.Adapters.XHR
          else if localStorage
            adapter = Store.Adapters.LocalStorage
          else
            throw "No supported adapters are found." unless indexedDB
        when 1
          throw "IndexedDB not supported" unless indexedDB
          adapter = Store.Adapters.WebSQL
        when 2
          throw "WebSQL not supported" unless indexedDB
          adapter = Store.Adapters.WebSQL
        when 3
          throw "FileSystem not supported" unless indexedDB
          adapter = Store.Adapters.FileSystem
        when 4
          throw "Xhr not supported" unless indexedDB
          adapter = Store.Adapters.XHR
        when 5
          throw "LocalStorage not supported" unless indexedDB
          adapter = Store.Adapters.LocalStorage
        else
          throw "Adapter not found" unless indexedDB
      
      adapter = new adapter prefix, callback            
      if adapter?
        for item in ['get','set','remove','list']
          @[item] = adapter[item].bind adapter
        
