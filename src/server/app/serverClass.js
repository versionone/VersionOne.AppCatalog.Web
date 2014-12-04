// Generated by CoffeeScript 1.6.3
(function() {
  var config, cors, createServer, express, handleError, matchesValidationError, mongoDb, mongoose, renderQueryResult, typeIsArray, _;

  express = require('express');

  mongoDb = require('mongodb').Db;

  mongoose = require('mongoose');

  cors = (require('./cors')).cors;

  config = require('./config');

  _ = require('underscore');

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

  createServer = function() {
    var app, auth, db, mongoOptions, service;
    mongoOptions = {
      db: {
        safe: true
      },
      server: {
        auto_reconnect: true,
        socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 30000
        }
      }
    };
    mongoDb.connect(config.mongoUri, mongoOptions, function(err, db) {
      if (err != null) {
        console.log('Could not connect: ');
        return console.log(err);
      } else {
        return mongoose.connect(config.mongoUri, mongoOptions);
      }
    });
    app = express();
    app.configure(function() {
      app.get('/', function(req, res) {
        return res.redirect('/app/index.html');
      });
      app.use('/app', express["static"]('../../client/app'));
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
          var rv;
          rv = JSON.stringify(result);
          rv = JSON.parse(rv);
          delete rv._id;
          delete rv.docVersion;
          return renderQueryResult(res, err, rv);
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
    app.get('/:id', function(req, res) {
      return res.redirect('/app/index.html#/Details/' + req.params.id);
    });
    return app;
  };

  module.exports = createServer;

}).call(this);
