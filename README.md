# hyper-json
[![Build
Status](https://secure.travis-ci.org/cainus/hyper-json.png?branch=master)](http://travis-ci.org/cainus/hyper-json)
[![Coverage Status](https://coveralls.io/repos/cainus/hyper-json/badge.png?branch=master)](https://coveralls.io/r/cainus/hyper-json)
[![NPM version](https://badge.fury.io/js/hyperjson.png)](http://badge.fury.io/js/hyper-json)

[![NPM](https://nodei.co/npm/hyperjson.png)](https://nodei.co/npm/hyperjson/)


This is a fluent interface for adding links to json documents.  Links are added in the Hyper+json style (documented 
[here](https://github.com/cainus/hyper-json-spec) ).

This sort of library is useful if you want to create hypermedia apis using json.

## A few examples:

### Basic Usage  (.toString())
Creates json strings from objects.
```javascript
var hyperjson = require('hyperjson');
hyperjson({thisis : "a test"}).toString();  // '{"thisis":"a test"}'
```

### .toObject()
Returns the resulting "json" object.
```javascript
hyperjson({thisis : "a test"}).toObject();  // {"thisis":"a test"}
```

### .property()
Adds a property to the json output.
```javascript
hyperjson({thisis : "a test"})
  .property("prop1", {random : "value"})
  .toObject();                 /* { 
                                    thisis : "a test", 
                                    prop1 : {
                                      random : "value"}
                                  }
                               */
```


### .link()
Adds a link to the json output.
```javascript
hyperjson({thisis : "a test"})
  .link("self", "http://localhost:8080/api/test")
  .toObject();                 /* { 
                                    thisis : "a test", 
                                    _links : {
                                      self : {
                                        href : "http://localhost:8080/api/test"
                                      }
                                  }
                               */
```
This can be called multiple times to add more links.  Note that if two links are assigned to the same key, the key will be mapped to an array of links.
```javascript
hyperjson({thisis : "a test"})
  .link("self", "http://localhost:8080/api/test")
  .link("parent", "http://localhost:8080/api/")
  .link("kid", "http://localhost:8080/api/kid1")
  .link("kid", "http://localhost:8080/api/kid2")
  .toObject();                 /* { 
                                    thisis : "a test", 
                                    _links : {
                                      self : {
                                        href : "http://localhost:8080/api/test"
                                      },
                                      parent : {
                                        href : "http://localhost:8080/api/"
                                      },
                                      kid : [{
                                        href : "http://localhost:8080/api/kid1"
                                      },{
                                        href : "http://localhost:8080/api/kid2"
                                      }]
                                  }
                               */
```
`link()` can also be used to add non-traditional links for HTTP methods other than GET.
```javascript
hyperjson({thisis : "a test"})
  .link("self", "http://percolatorjs.com", {type : 'application/json', schema : {}, method : 'POST'})
  .toObject();                  /* {  
                                      thisis : "a test", 
                                      _links : {
                                          self : { href : "http://percolatorjs.com",
                                                   type : 'application/json',
                                                   schema : {},
                                                   method : 'POST' }
                                      }
                                   }
                                */
```
In addition, the options argument of `link()` can also take a `when` property, which maps to a function or an expression.  The link will be added if and only if this function or expression is truthy.
```javascript
hyperjson({thisis : "a test"})
  .link("self", "http://percolatorjs.com", {when: 1 + 1 === 2, method: 'POST'})
  .toObject();                  /* {  
                                      thisis : "a test", 
                                      _links : {
                                          self : { 
                                            href : "http://percolatorjs.com",
                                            method: 'POST'
                                          }
                                      }
                                   }
                                */

hyperjson({thisis : "a test"})
  .link("self", "http://percolatorjs.com", {when: function(obj) {obj.thisis === "a test"})
  .toObject();                  /* {  
                                      thisis : "a test", 
                                      _links : {
                                          self : { href : "http://percolatorjs.com" }
                                      }
                                   }
                                */

hyperjson({thisis : "a test"})
  .link("self", "http://percolatorjs.com", {when: function(obj) {obj.thisis === "not a test"})
  .toObject();                  // {  thisis : "a test" } - no links are created
                                
```
Check out the [hyper+json spec](https://github.com/cainus/hyper-json-spec) if you want to read more about these kinds of links.

