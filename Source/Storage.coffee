class Store
  constructor: (options = {})->
    @prefix = options.prefix || ""
    ad = parseInt(options.adapter) || 0
    
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
          throw "No supported adapters are found."
      when 1
        throw "IndexedDB not supported" unless indexedDB
        adapter = Store.Adapters.IndexedDB
      when 2
        throw "WebSQL not supported" unless openDatabase
        adapter = Store.Adapters.WebSQL
      when 3
        throw "FileSystem not supported" unless requestFileSystem
        adapter = Store.Adapters.FileSystem
      when 4
        throw "LocalStorage not supported" unless localStorage
        adapter = Store.Adapters.LocalStorage
      when 5
        throw "Xhr not supported" unless xhr
        adapter = Store.Adapters.XHR
      when 6
        adapter = Store.Adapters.Memory
      else
        throw "Adapter not found"
    
    ['get','set','remove','list'].forEach (item) =>
        @[item] = ->
          args = Array::slice.call arguments
          if @running
            @chain item, args
          else
            @call item, args
          @
    
    @$chain = []
    @adapter = new adapter()
    @adapter.init.call @, (store) =>
      @ready = true
      if typeof options.callback is 'function' then options.callback @
      @callChain()
  
  error: ->
    console.error arguments
  
  serialize: (obj) ->
    JSON.stringify obj
  deserialize: (json) ->
    JSON.parse json 
      
  chain: (type, arguments) ->
    @$chain.push [type, arguments]
  callChain: ->
    if @$chain.length > 0
      first = @$chain.shift()
      @call first[0], first[1]
  call: (type, args) ->
    @running = true
    unless @ready
      @chain type, args
    else
      if type is 'set'
        if args.length == 3
          callback = args.pop()
      else if type is 'list'
        if args.length == 1
          callback = args.pop()
      else
        if args.length == 2
          callback = args.pop()
      @adapter[type].apply @, args.concat (data) =>
        if typeof callback is 'function' then callback data
        @running = false
        @callChain()
        
Store.ADAPTER_BEST = 0
Store.INDEXED_DB = 1
Store.WEB_SQL = 2
Store.FILE_SYSTEM = 3
Store.LOCAL_STORAGE = 4
Store.XHR = 5
Store.MEMORY = 6
Store.Adapters = {}
