# Object Based Adapter (not presistent)

#
CoffeeStore.Adapters.Memory = class
  init: (callback) ->
    @store = {}
    callback @
  # Get Item
  get: (key, callback) -> 
    if (a = @store[key.toString()])
      ret = @deserialize a
    else
      ret = false
    callback ret 
  # Set Item
  set: (key, value, callback) ->
    try
      @store[key.toString()] = @serialize value
      ret = true 
    catch error
      @error error
    callback ret or false
  # List Keys
  list: (callback) ->
    ret = []
    try
      ret = for own key of @store 
        key
    catch error
      @error error
    callback ret
  # Remove Item
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
