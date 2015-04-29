var HyperJson = function(source){
  if ( !(this instanceof HyperJson) ) {
    return new HyperJson(source);
  }
  var obj = {};
  var keys = Object.keys(source);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    obj[key] = source[key];
  }
  this.obj = obj;
};

HyperJson.prototype.toString = function(){
  return JSON.stringify(this.obj);
};

HyperJson.prototype.toObject = function(){
  return this.obj;
};

HyperJson.prototype.property = function(name, value){
  this.obj[name] = value;
  return this;
};

HyperJson.prototype.link = function(rel, href, options){
  options = options || {};
  var linkObj = { href : href};
  var keys = Object.keys(options);
  var whenCondition;
  for (var i = keys.length - 1; i >= 0; --i) {
    var name = keys[i];
    if (['method', 'type', 'schema', 'when'].indexOf(name) === -1) {
      throw "unknown option: " + name;
    }

    if (name === 'when') {
      whenCondition = options.when;
    } else {
      linkObj[name] = options[name];
    }
  }

  // Attach the link only if there is no whenCondition, or if the whenCondition is true.
  if (typeof whenCondition === "undefined" || (isFunction(whenCondition) ? whenCondition(this.obj) : !!whenCondition)) {
    if (!this.obj._links){
      this.obj._links = {};
    }
    if (!this.obj._links[rel]){
      this.obj._links[rel] = linkObj;
    } else {
      var relObj = this.obj._links[rel];
      if (!Array.isArray(relObj)){
        this.obj._links[rel] = [relObj];
      }
      this.obj._links[rel].push(linkObj);
    }
  }

  return this;
};

module.exports = HyperJson;

var isFunction = function(functionToCheck) {
 return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};