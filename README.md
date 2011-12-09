KeyStore
========
The goal of this project is to create a Key:Value store for most of the WebStorage options, with a clean, simple, unified API.

## Supported Adapters
* **WebSQL (SQLite)**  
Chrome 4+, Opera 10.5+, Safari 3.1+, and Android Browser 2.1+
5MB of data per DB, but can request more
* **IndexedDB**  
IE 10+, FireFox 4+, and Chrome 11+
* **localStorage**  
Safari 4+, Mobile Safari (iPhone/iPad), Firefox 3.5+, Internet Explorer 8+ and Chrome 4+
5MB of data per domain
* **FileSystem**
Chrome 12+
* **XmlHttpRequest**

## Example
```coffeescript
try
  store = new Store prefix: 'mystore', adapter: Store.LOCAL_STORAGE
catch error
  console.log error
store.set 'mykey', 'myvalue', (success) ->
  if success
    console.log 'successfully set mykey'
    store.get 'mykey', (data) ->
      if data
        console.log 'mykey has data:' + data
        store.remove 'mykey', (success) ->
          if success
            console.log 'mykey removed successfully'
```
