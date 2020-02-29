// Generated by CoffeeScript 1.10.0
(function() {
  var MockAppCatalogEntry, mock, must, requireCover, should, sinon, svc;

  requireCover = require('./requireCover')('app');

  should = require('should');

  sinon = require('sinon');

  must = function(name, mock, configCallback) {
    return it(name, function(done) {
      configCallback();
      mock.verify();
      mock.restore();
      return done();
    });
  };

  MockAppCatalogEntry = (function() {
    MockAppCatalogEntry.currentInstance = {};

    function MockAppCatalogEntry(body) {
      this.id = body.id;
      MockAppCatalogEntry.currentInstance = this;
    }

    MockAppCatalogEntry.prototype.save = sinon.spy();

    MockAppCatalogEntry.find = function() {};

    MockAppCatalogEntry.findOne = function() {};

    MockAppCatalogEntry.updateOne = function() {};

    MockAppCatalogEntry.validate = function() {};

    return MockAppCatalogEntry;

  })();

  mock = sinon.mock(MockAppCatalogEntry);

  svc = requireCover('service');

  describe('service', function() {
    describe('#findAll', function() {
      var subject;
      subject = new svc(MockAppCatalogEntry);
      return must('call find', mock, function() {
        mock.expects('find').once().withArgs({}, '');
        return subject.findAll();
      });
    });
    describe('#findById', function() {
      var subject;
      subject = new svc(MockAppCatalogEntry);
      return must('call findOne', mock, function() {
        var id;
        id = 'v1clarityppm';
        mock.expects('findOne').once().withArgs({
          id: id
        }, '');
        return subject.findById(id);
      });
    });
    return describe('#put', function() {
      var subject;
      subject = new svc(MockAppCatalogEntry);
      return must('call validate and updateOne', mock, function() {
        var body, id;
        id = 'v1clarityppm';
        body = {
          id: id
        };
        mock.expects('validate').once().withArgs(body).callsArg(1);
        mock.expects('updateOne').once().withArgs(body, {
          $set: {
            id: id
          },
          $inc: {
            docVersion: 1
          }
        }, {
          upsert: true
        }).callsArg(3);
        return subject.put(body, function(err) {});
      });
    });
  });

}).call(this);
