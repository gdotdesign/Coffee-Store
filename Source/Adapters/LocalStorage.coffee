define 'Store.Adapters.Abstract', "Store.Adapters.LocalStorage", ->
  class LocalStorageAdapter extends Store.Adapters.Abstract
    constructor: (prefix, callback) ->
      @prefix = prefix+"::"
      if typeof callback is 'function' then callback.call @
    get: (key, callback = ->) ->
      try
        ret = @deserialize localStorage.getItem @prefix+key.toString()
        console.log ret
      catch error
        ret = error
      if typeof callback is 'function' then callback.call @, ret
    set: (key, value, callback) ->
      try
        ret = localStorage.setItem @prefix+key.toString(), @serialize value
      catch error
        ret = error
      if typeof callback is 'function' then callback.call @, ret
    list: (callback) ->
      ret = []
      for i in [0..localStorage.length-1]
        try
          if (key = localStorage.key(i)).test new RegExp("^#{@prefix}")
            ret.push key.replace new RegExp("^#{@prefix}"), ""
        catch error
          ret = error
      if typeof callback is 'function' then callback.call @, ret
    remove: (key, callback) ->
      try
        ret = localStorage.removeItem @prefix+key.toString()
        console.log ret
      catch error
        ret = error
      if typeof callback is 'function' then callback.call @, ret
