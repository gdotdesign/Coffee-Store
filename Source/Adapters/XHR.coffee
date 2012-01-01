Store.Adapters.XHR = class
  init: (callback) ->
    # TODO whitout mootools
    @request = new Request.JSON url: @prefix
    @request.addEvent 'success', (obj) =>
      r = if @type is 'get' then @deserialize(obj) else obj
      @callback r
    @request.addEvent 'failure', =>
      @callback false
    callback @
  get: (key, callback) ->
    @type = 'get'
    @request.get {key:key}
    @callback = callback
  set: (key, value, callback) ->
    @type = 'set'
    @request.post {key:key, value: @serialize value}
    @callback = callback
  list: (callback) ->
    @type = 'list'
    @request.get()
    @callback = callback
  remove: (key, callback) ->
    @type = 'remove'
    @request.delete {key:key}
    @callback = callback
