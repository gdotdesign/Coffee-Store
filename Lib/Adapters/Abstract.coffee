define "Store", "Store.Adapters.Abstract", ->
  class AbstractStorageAdapter
    serialize: (obj) ->
      JSON.stringify obj
    deserialize: (json) ->
      JSON.parse json
    #set: (key,value,callback) ->
