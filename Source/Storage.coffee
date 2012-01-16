#Class CoffeeStore
class CoffeeStore
  #Constructor
  #
  #     options = {
  #       prefix: String
  #       adapter: Int [0..6]
  #       serialize: Function
  #       deserialize: Function
  #     }
  constructor: (options = {})->
    
    # Options parsing
    @prefix = options.prefix or ""
    ad = parseInt(options.adapter) or 0
    
    # Custom Serialization
    @$serialize = options.serialize if typeof options.serialize is 'function'
    @$deserialize = options.deserialize if typeof options.deserialize is 'function'
    
    # Checking for features
    a = window
    indexedDB = 'indexedDB' of a or 'webkitIndexedDB' of a or 'mozIndexedDB' of a
    requestFileSystem = 'requestFileSystem' of a or 'webkitRequestFileSystem' of a
    websql = 'openDatabase' of a
    localStore = 'localStorage' of a
    xhr = 'XMLHttpRequest' of a
    
    # Get Adapter
    adapter = switch ad
      when 0
        if indexedDB
          CoffeeStore.Adapters.IndexedDB
        else if openDatabase
          CoffeeStore.Adapters.WebSQL
        else if requestFileSystem
          CoffeeStore.Adapters.FileSystem
        else if xhr
          CoffeeStore.Adapters.XHR
        else if localStorage
          CoffeeStore.Adapters.LocalStorage
        else
          CoffeeStore.Adapters.Memory
      when 1
        throw "IndexedDB not supported!" unless indexedDB
        CoffeeStore.Adapters.IndexedDB
      when 2
        throw "WebSQL not supported!" unless openDatabase
        CoffeeStore.Adapters.WebSQL
      when 3
        throw "FileSystem not supported!" unless requestFileSystem
        CoffeeStore.Adapters.FileSystem
      when 4
        throw "LocalStorage not supported!" unless localStorage
        CoffeeStore.Adapters.LocalStorage
      when 5
        throw "XHR not supported!" unless xhr
        CoffeeStore.Adapters.XHR
      when 6
        CoffeeStore.Adapters.Memory
      else
        throw "Adapter not found!"
    
    # Setting up methods
    ['get','set','remove','list'].forEach (item) =>
        @[item] = ->
          args = Array::slice.call arguments
          if @running
            @chain item, args
          else
            @call item, args
          @
    
    # Array for chaining
    @$chain = []
    
    # Creating the adapter
    @adapter = new adapter()
    
    # Calling init
    @adapter.init.call @, (store) =>
      @ready = true
      if typeof options.callback is 'function' then options.callback @
      @callChain()
  
  error: ->
    console.error arguments
  
  # Serialization
  serialize: (obj) -> 
    if @$serialize
      return @$serialize obj
    JSON.stringify obj
  deserialize: (json) ->
    if @$deserialize
      return @$deserialize obj
    JSON.parse json 
  
  # Chaining    
  chain: (type, args) ->
    @$chain.push [type, args]
  callChain: ->
    if @$chain.length > 0
      first = @$chain.shift()
      @call first[0], first[1]
      
  # Calling method
  call: (type, args) ->
    # Chain method if the adapter isnt ready yet
    unless @ready
      @chain type, args
    else
      @running = true
      # Get callback based on method
      if (type is 'set' and args.length is 3) or (type is 'list' and args.length is 1) or ((type is 'get' or type is 'remove') and args.length is 2)
        callback = args.pop()
      # Call adapter method
      @adapter[type].apply @, args.concat (data) =>
        if typeof callback is 'function' then callback data
        @running = false
        # When finished call chain
        @callChain()

# Adapter integers        
CoffeeStore.ADAPTER_BEST = 0
CoffeeStore.INDEXED_DB = 1
CoffeeStore.WEB_SQL = 2
CoffeeStore.FILE_SYSTEM = 3
CoffeeStore.LOCAL_STORAGE = 4
CoffeeStore.XHR = 5
CoffeeStore.MEMORY = 6
CoffeeStore.Adapters = {}
