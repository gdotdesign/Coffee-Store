# FileSystem adapter for Chrome12+
#
# More info on specs: [File System API](http://www.w3.org/TR/file-system-api/)

#
CoffeeStore.Adapters.FileSystem = class
  # Get RequestFileSystem and initalize FileSystem
  init: (callback) ->
    rfs = window.RequestFileSystem || window.webkitRequestFileSystem
    rfs window.PRESISTENT, 50*1024*1024, (store) =>
      @storage = store
      callback @
    , @error
  # List keys  
  list: (callback) ->
    dirReader = @storage.root.createReader()
    entries = []
    # Read entries recursive function
    readEntries = =>
      dirReader.readEntries (results) ->
        if (!results.length)
          entries.sort()
          callback entries.map (item) ->
            item.name
        else 
          entries = entries.concat(Array.from(results))
          readEntries()
      , @error
    readEntries()
  # Remove item
  remove: (file, callback) ->
    @storage.root.getFile file, null, (fe) =>
      fe.remove ->
        callback true
      , ->
        callback false
    , ->
      callback false
  # Get Item
  get: (file, callback) ->
    @storage.root.getFile file, null, (fe) =>
      fe.file (f) =>
        # Read as text
        reader = new FileReader()
        reader.onloadend = (e) =>
          callback @deserialize e.target.result
        reader.readAsText f
      , ->
        callback false
    , ->
      callback false
  # Set Item
  set: (file, data, callback = ->) ->
    # Get file or create if null
    @storage.root.getFile file, {create:true}, (fe) =>
      fe.createWriter (fileWriter) =>
        # return true if the write is finished.
        fileWriter.onwriteend = (e) =>
          callback true
        # return false on error
        fileWriter.onerror = (e) =>
          callback false
        #Write with BlobBuilder
        bb = new (window.WebKitBlobBuilder || BlobBuilder())
        bb.append(@serialize data)
        fileWriter.write(bb.getBlob('text/plain'))
      , ->
        callback false
    , ->
      callback false
