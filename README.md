Coffee-Store
============

Coffee-Store is a simple Key - Value storage interface (via adapters) for local storage implementations.

Features

* Chaining
* Async
* Adapters
* Migrations #TODO
* Multiple stores

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
* **Memory**

## Example
Simple store with LocalStorage adapter

```coffeescript
store = new Store prefix: 'mystore', adapter: Store.LOCAL_STORAGE
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

If no adapter given the best will be chosen for you.

```coffeescript
store = new Store prefix: 'mystore'
```

## Specs
To run the specs you will need Coffee-Script, Ruby 1.9.3, RubyGems and Bundler installed.

* Navigate to `Specs`
* Run `bundle install`
* Run `rackup`
* Navigate to `localhost:9292` in your browser

## Contribute
You can add your own adapters to the library. You can find the [Adapter specs](https://github.com/gdotdesign/KVStore/wiki/Adapter-Specification) at the wiki. In order to get your code commited to the source, your code needs to be:

* Written in coffee-script
* Follow the sources style
* Pass the specs

There will not be any plugins and such for this library in order to keep it clean and simple.

Any fixes or more simple or condesed code is welcome.

## Building
To build the source you will need nodejs installed with the coffee-script, uglify-js and commander npm packages.

```
Usage: build [options]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
  -u, --uglify   Uglify
  -p, --print    Print the build to the stdout
```

The resulting file will be in the `Build` folder as `coffee-store.js` or `coffee-store-min.js` if uglified.

## TODO

* Make XHR request not framework dependent.
* PhoneGap adapter
* Cleanup
* Testing on different browsers
* Migrations
