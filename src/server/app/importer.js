// Generated by CoffeeScript 1.10.0
(function() {
  module.exports = function(source) {
    var prop, results;
    results = [];
    for (prop in source) {
      results.push(global[prop] = source[prop]);
    }
    return results;
  };

}).call(this);
