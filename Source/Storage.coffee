define null, "Store", ->
  class Store
    constructor: (prefix = "", callback)->
      a = window
      a.indexedDB = a.indexedDB || a.webkitIndexedDB || a.mozIndexedDB
      a.requestFileSystem = a.requestFileSystem || a.webkitRequestFileSystem
      adapter = new Store.Adapters.LocalStorage prefix, callback
      ###
      if a.indexedDB
        adapter = new Store.Adapters.IndexedDB prefix, callback
      else if a.openDatabase
        adapter = new Store.Adapters.WebSQL prefix, callback
      else if a.requestFileSystem
        adapter = new Store.Adapters.FileSystem prefix, callback
      else if a.localStorage
        adapter = new Store.Adapters.LocalStorage prefix, callback
      ###
      if adapter?
        for item in ['get','set','remove','list']
          @[item] = adapter[item].bind adapter
        
