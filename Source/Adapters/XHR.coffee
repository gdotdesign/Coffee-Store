define 'Store.Adapters.Abstract', "Store.Adapters.XHR", ->
  class XHRStorageAdapter extends Store.Adapters.Abstract
    constructor: (prefix,callback) ->
      # TODO whitout mootools
      @request = new Request.JSON url: prefix
      @request.addEvent 'success', (obj) =>
        if typeof @callback is 'function' then @callback @deserialize(obj) or false
      @request.addEvent 'failure', =>
        if typeof @callback is 'function' then @callback false
      if typeof callback is 'function' then callback.call @, @
    get: (key, callback) ->
      unless @request.isRunning()
        @request.get {key:key}
        @callback = callback
    set: (key, value, callback) ->
      unless @request.isRunning()
        @request.post {key:key, value: @serialize value}
        @callback = callback
    list: (callback) ->
      unless @request.isRunning()
        @request.get()
        @callback = callback
    remove: (key, callback) ->
      unless @request.isRunning()
        @request.delete {key:key}
        @callback = callback
