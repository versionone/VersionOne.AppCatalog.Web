// Generated by CoffeeScript 1.6.2
(function() {
  var config;

  config = {};

  config.entryRoute = '/entry';

  config.localPort = 8088;

  if (process.env.PORT == null) {
    config.mongoUrl = 'mongodb://localhost/test';
  } else {
    config.mongoUrl = 'mongodb://localhost/test';
  }

  module.exports = config;

}).call(this);
