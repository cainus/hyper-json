HyperJson = function(source){
  if ( !(this instanceof arguments.callee) ) {
    return new HyperJson(source);
  }
  this.obj = {};
  for (var x in source) {
    this.obj[x] = source[x];
  }
};

HyperJson.prototype.toString = function(){
  return JSON.stringify(this.obj);
};

HyperJson.prototype.toObject = function(){
  return this.obj;
};

HyperJson.prototype.property =function(name, value){
  this.obj[name] = value;
  return this;
};

HyperJson.prototype.link = function(rel, href, opts){
  var options = opts || {};
  var linkObj = { href : href};
  var whenCondition;
  for (var name in options){
    if (['method', 'type', 'schema', 'when'].indexOf(name) === -1) throw "unknown option: " + name;

    if (name == 'when') {
      whenCondition = options['when'];
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
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}