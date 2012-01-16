# LocalStorage Adapter (almost all browser implemented it now)
#
# More info on specs: [Web Storage API](http://dev.w3.org/html5/webstorage/)

#
CoffeeStore.Adapters.LocalStorage = class
  # We need to prefix keys because of the nature of localStorage
  init: (callback) ->
    @prefix += "::" unless @prefix is ""
    callback @
  # Get Item
  get: (key, callback) ->
    try
      ret = @deserialize localStorage.getItem @prefix+key.toString()
    catch error
      @error error
    callback ret or false
  # Set Item
  set: (key, value, callback) ->
    try
      localStorage.setItem @prefix+key.toString(), @serialize value
      ret = true 
    catch error
      @error error
    callback ret or false
  # List Keys
  list: (callback) ->
    ret = []
    for i in [0..localStorage.length-1]
      try
        key = localStorage.key(i)
        if @prefix != ""
          if new RegExp("^#{@prefix}").test key
            ret.push key.replace new RegExp("^#{@prefix}"), ""
        else
          ret.push key
      catch error
        @error error
    callback ret
  # Remove Item
  remove: (key, callback) ->
    if localStorage.getItem(@prefix+key) is null
      callback false 
      return
    try
      localStorage.removeItem @prefix+key.toString()
      ret = true
    catch error
      @error error
    callback ret or false
