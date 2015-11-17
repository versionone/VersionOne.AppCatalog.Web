// Generated by CoffeeScript 1.10.0
(function() {
  var app, config, fs, get, getList, put, putWithoutAuth, request, requireCover, server, should, testData;

  requireCover = require('./requireCover')('app');

  fs = require('fs');

  request = require('supertest');

  server = requireCover('serverClass');

  should = require('should');

  testData = requireCover('testData');

  config = requireCover('config');

  app = server();

  put = function(entry, expectStatus, assertCallback) {
    return request(app).put('/entry').type('application/json').auth(config.user, config.password).send(entry).expect('Content-Type', /json/).end(assertCallback);
  };

  putWithoutAuth = function(entry, assertCallback) {
    return request(app).put('/entry').type('application/json').send(entry).end(assertCallback);
  };

  describe('PUT /entry fails without basic authentication', function() {
    return it('responds with JSON failure message', function(done) {
      var entry;
      entry = testData.fullyValidEntry();
      return putWithoutAuth(entry, function(err, res) {
        should.not.exist(err);
        res.text.should.eql('Unauthorized');
        return done();
      });
    });
  });

  describe('PUT /entry for Happy Path With Required Data', function() {
    return it('responds with JSON success message', function(done) {
      var entry;
      entry = testData.fullyValidEntry();
      return put(entry, 200, function(err, res) {
        var message;
        should.not.exist(err);
        message = JSON.parse(res.text);
        should.exist(message);
        message.status.should.eql(200);
        message.message.should.eql('Successfully updated entry');
        return done();
      });
    });
  });

  describe('PUT /entry for each examples succeeds', function() {
    return it('responds with JSON success message', function(done) {
      var count, entry, file, files, i, len1, ref, results;
      files = fs.readdirSync('./examples');
      count = files.length;
      ref = fs.readdirSync('./examples');
      results = [];
      for (i = 0, len1 = ref.length; i < len1; i++) {
        file = ref[i];
        entry = JSON.parse(fs.readFileSync('./examples/' + file, 'utf8'));
        results.push((function() {
          var doc;
          doc = entry;
          return put(doc, 200, function(err, res) {
            var message;
            count--;
            console.error('id: ' + doc.id);
            console.error(res.text);
            should.not.exist(err);
            message = JSON.parse(res.text);
            should.exist(message);
            message.status.should.eql(200);
            message.message.should.eql('Successfully updated entry');
            if (count === 0) {
              return done();
            }
          });
        })());
      }
      return results;
    });
  });

  describe('PUT /entry for Failure Path With Invalid JSON', function() {
    return it('responds with JSON failure message', function(done) {
      var entry;
      entry = {
        "idNotAValidName": "FailurePathWithInvalidJSON"
      };
      return put(entry, 500, function(err, res) {
        var message;
        should.not.exist(err);
        message = JSON.parse(res.text);
        should.exist(message);
        message.status.should.eql(500);
        message.message.title.should.eql('Could not process your request due to validation errors');
        return done();
      });
    });
  });

  get = function(entryId, expectStatus, assertCallback) {
    return request(app).get('/entry?id=' + entryId).expect('Content-type', /json/).end(assertCallback);
  };

  getList = function(expectStatus, assertCallback) {
    return request(app).get('/entry').expect('Content-type', /json/).end(assertCallback);
  };

  describe('GET /entry returns all entries', function() {
    return it('returns entries list', function(done) {
      return getList(200, function(err, res) {
        var data, len;
        should.not.exist(err);
        data = JSON.parse(res.text);
        len = data.length;
        len.should.be.above(0);
        return done();
      });
    });
  });

  describe('GET /entry?id=:id returns a single entry', function() {
    return it('returns a single entry', function(done) {
      var entry, id;
      entry = testData.fullyValidEntry();
      id = entry.id;
      return put(entry, 200, function(err, res) {
        var message;
        should.not.exist(err);
        message = JSON.parse(res.text);
        should.exist(message);
        message.status.should.eql(200);
        return get(id, 200, function(err, res) {
          var data;
          should.not.exist(err);
          data = JSON.parse(res.text);
          data.id.should.eql(id);
          return done();
        });
      });
    });
  });

  describe('GET / redirects to /app/index.html', function() {
    return it('redirects properly', function(done) {
      return request(app).get('/').expect(302).expect('Location', '/app/index.html', done);
    });
  });

  describe('GET /VersionOne.Integration.Bugzilla to /app/index.html#/Details/VersionOne.Integration.Bugzilla', function() {
    return it('redirects properly', function(done) {
      return request(app).get('/VersionOne.Integration.Bugzilla').expect(302).expect('Location', '/app/index.html#/Details/VersionOne.Integration.Bugzilla', done);
    });
  });

}).call(this);
