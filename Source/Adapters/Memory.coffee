_keys = Object.keys or (obj) ->
  if obj isnt Object(obj) then throw new TypeError('Invalid object')
  keys = []
  for own key of obj 
    key
Store.Adapters.Memory = class
  init: (callback) ->
    @store = {}
    callback @
  get: (key, callback) ->
    try 
      ret = @deserialize @store[key.toString()]
    catch error
      @error error
    callback ret or false
  set: (key, value, callback) ->
    try
      @store[key.toString()] = @serialize value
      ret = true 
    catch error
      @error error
    callback ret or false
  list: (callback) ->
    ret = []
    try
      ret = _keys @store
    catch error
      @error error
    callback ret
  remove: (key, callback) ->
    if @store[key.toString()] is undefined
      callback false 
      return
    try
      delete @store[key.toString()]
      ret = true
    catch error
      @error error
    callback ret or false
