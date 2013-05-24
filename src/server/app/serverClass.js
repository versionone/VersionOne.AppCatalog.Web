// Generated by CoffeeScript 1.6.2
(function() {
  var config, cors, createServer, express, mongoose;

  express = require('express');

  mongoose = require('mongoose');

  cors = (require('./cors')).cors;

  config = require('./config');

  createServer = function() {
    var app, auth, db, handleError, matchesValidationError, renderQueryResult, service, typeIsArray;

    mongoose.connect(config.mongoUri);
    app = express();
    app.configure(function() {
      app.use('/app', express["static"]('../../../angular/app'));
      app.use(express.bodyParser());
      app.use(cors);
      return app.use(app.router);
    });
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      return app.listen(config.port, function() {});
    });
    db.disconnect;
    auth = express.basicAuth(config.user, config.password);
    service = new (require('./service'));
    app.get(config.entryRoute, function(req, res) {
      if (req.query.id == null) {
        return service.findAll(function(err, result) {
          return renderQueryResult(res, err, result);
        });
      } else {
        return service.findById(req.query.id, function(err, result) {
          return renderQueryResult(res, err, result);
        });
      }
    });
    app.put(config.entryRoute, auth, function(req, res) {
      if (req.body == null) {
        return;
      }
      return service.put(req.body, function(err) {
        if (err != null) {
          return handleError(res, err);
        } else {
          return res.send({
            status: 200,
            message: 'Successfully updated entry'
          });
        }
      });
    });
    renderQueryResult = function(res, err, result) {
      if (err == null) {
        res.send(result);
        return true;
      }
      if (err != null) {
        handleError(res, err);
        return false;
      }
    };
    handleError = function(res, err) {
      if (err != null) {
        if (matchesValidationError(err)) {
          return res.send(500, {
            status: 500,
            message: {
              title: 'Could not process your request due to validation errors'
            },
            errors: err
          });
        } else {
          return res.send(500, {
            status: 500,
            message: 'Could not process your request due to invalid input data'
          });
        }
      }
    };
    typeIsArray = function(value) {
      return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    };
    matchesValidationError = function(obj) {
      return typeIsArray(obj) && (obj[0].instanceContext != null) && (obj[0].resolutionScope != null);
    };
    return app;
  };

  module.exports = createServer;

}).call(this);
