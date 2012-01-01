fs = require 'fs'
Coffee = require('coffee-script')
module.exports = 
  compile: ->
    code = ''
    code += fs.readFileSync './Source/Storage.coffee', 'UTF-8'
    code += fs.readFileSync './Source/Adapters/LocalStorage.coffee', 'UTF-8'
    code += fs.readFileSync './Source/Adapters/IndexedDB.coffee', 'UTF-8'
    
    Coffee.compile(code, {bare:yes})
