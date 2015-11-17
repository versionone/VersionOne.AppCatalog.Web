// Generated by CoffeeScript 1.10.0
(function() {
  var AppCatalogEntry, AppCatalogService;

  AppCatalogEntry = require('./appCatalogEntry');

  AppCatalogService = (function() {
    function AppCatalogService(appCatalogEntry) {
      this.appCatalogEntry = appCatalogEntry != null ? appCatalogEntry : null;
      if (this.appCatalogEntry == null) {
        this.appCatalogEntry = AppCatalogEntry;
      }
    }

    AppCatalogService.prototype.findAll = function(callback) {
      return this.appCatalogEntry.find({}, '', function(err, result) {
        return callback(err, result);
      });
    };

    AppCatalogService.prototype.findById = function(id, callback) {
      return this.appCatalogEntry.findOne({
        'id': id
      }, '', callback);
    };

    AppCatalogService.prototype.put = function(body, callback) {
      var error, ex;
      try {
        return this.appCatalogEntry.validate(body, (function(_this) {
          return function(errs) {
            var entry;
            if (errs != null) {
              return callback(errs);
            } else {
              entry = new _this.appCatalogEntry(body);
              return _this.appCatalogEntry.update({
                'id': body.id
              }, {
                $set: body,
                $inc: {
                  docVersion: 1
                }
              }, {
                upsert: true
              }, function(err, data) {
                return callback(err);
              });
            }
          };
        })(this));
      } catch (error) {
        ex = error;
        return callback(ex);
      }
    };

    return AppCatalogService;

  })();

  module.exports = AppCatalogService;

}).call(this);
