@suites = {}
['LOCAL_STORAGE','INDEXED_DB','WEB_SQL','XHR','FILE_SYSTEM','MEMORY'].forEach (adapter) ->
  store = new CoffeeStore adapter: CoffeeStore[adapter], prefix: adapter
  @suites[adapter] = {}
  
  @suites[adapter]["#{adapter}: should retrun false for no key (get)"] = (test) -> 
      store.get 'asd', (success) ->
        test.strictEqual success, false
        test.done()
  @suites[adapter]["#{adapter}: should retrun false for no key (remove)"] = (test) -> 
      store.remove 'asd', (success) ->
        test.strictEqual success, false
        test.done()
  @suites[adapter]["#{adapter}: should set item"] = (test) -> 
      store.set 'testKey', 'testData', (success) ->
        test.strictEqual success, true
        store.get 'testKey', (data) ->
          test.strictEqual data, 'testData'
          test.done()
  @suites[adapter]["#{adapter}: should get item"] = (test) -> 
      store.get 'testKey', (data) ->
        test.strictEqual data, 'testData'
        test.done()
  @suites[adapter]["#{adapter}: should list items"] = (test) -> 
      store.list (data) ->
        test.strictEqual data.indexOf('testKey'), 0
        test.done()
  @suites[adapter]["#{adapter}: should remove item"] = (test) -> 
      store.remove 'testKey',  (success) ->
        test.strictEqual success, true
        test.done()
  @suites[adapter]["#{adapter}: should return empty array from list"] = (test) -> 
      store.list (data) ->
        test.strictEqual data.length, 0
        test.done()
  @suites[adapter]["#{adapter}: chain test"] = (test) -> 
      store.set('testKey', 'testData').get('testKey').set('testKey','hello there matey').get('testKey').remove 'testKey', (data) ->
        test.strictEqual data, true
        test.done() 
