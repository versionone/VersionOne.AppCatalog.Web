fs = require 'fs'
request = require 'supertest'
server = require './serverClass'
should = require 'should'
testData = require './testData'
config = require './config'

# Run server
app = server()

put = (entry, expectStatus, assertCallback) ->
  request(app)
    .put('/entry')
    .type('application/json')
    .auth(config.user, config.password)
    .send(entry)      
    .expect('Content-Type', /json/)
    .end assertCallback

putWithoutAuth = (entry, assertCallback) ->
  request(app)
    .put('/entry')
    .type('application/json')
    .send(entry)      
    .end assertCallback

describe 'PUT /entry fails without basic authentication', ->
  it 'responds with JSON failure message', (done) ->
    entry = testData.fullyValidEntry()
    putWithoutAuth entry, (err, res) ->
      should.not.exist err
      res.text.should.eql 'Unauthorized'
      #message.message.title.should.eql 'Could not process your request due to missing authentication'
      done()

describe 'PUT /entry for Happy Path With Required Data', ->
  it 'responds with JSON success message', (done) ->
    entry = testData.fullyValidEntry()
    put entry, 200, (err, res) ->
      should.not.exist err
      message = JSON.parse res.text
      should.exist message
      message.status.should.eql 200
      message.message.should.eql 'Successfully updated entry'
      done()

describe 'PUT /entry for each examples succeeds', ->
  it 'responds with JSON success message', (done) ->
    files = fs.readdirSync './examples'
    count = files.length
    for file in fs.readdirSync './examples'
      entry = JSON.parse fs.readFileSync('./examples/' + file, 'utf8')
      (->
        doc = entry
        put doc, 200, (err, res) ->
          count--
          console.error 'id: ' + doc.id
          console.error res.text
          should.not.exist err
          message = JSON.parse res.text
          should.exist message
          message.status.should.eql 200
          message.message.should.eql 'Successfully updated entry'
          if count == 0
            done()
      )()

describe 'PUT /entry for Failure Path With Invalid JSON', ->
  it 'responds with JSON failure message', (done) ->
    entry = {
      "idNotAValidName": "FailurePathWithInvalidJSON"
    }
    put entry, 500, (err, res) ->
      should.not.exist err
      message = JSON.parse res.text
      should.exist message
      message.status.should.eql 500
      message.message.title.should.eql 'Could not process your request due to validation errors'
      done()