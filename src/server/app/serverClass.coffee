express = require 'express'
mongoDb = require('mongodb').Db
mongoose = require 'mongoose'
cors = (require './cors').cors
config = require './config'
_ = require 'underscore'

renderQueryResult = (res, err, result) ->
  unless err?
    res.send result
    return true
  if err?      
    handleError res, err
    return false

handleError = (res, err) ->
  if err?
    if matchesValidationError err
      res.send 500, {status:500, message: {title:'Could not process your request due to validation errors'}, errors: err }
    else
      res.send 500, {status:500, message: 'Could not process your request due to invalid input data'}

typeIsArray = (value) ->
  value and
    typeof value is 'object' and
    value instanceof Array and
    typeof value.length is 'number' and
    typeof value.splice is 'function' and
    not ( value.propertyIsEnumerable 'length' )

matchesValidationError = (obj) ->
  return typeIsArray(obj) and
    obj[0].instanceContext? and
    obj[0].resolutionScope?

createServer = ->  
  mongoOptions =
    db: safe: true
    server:  
      auto_reconnect: true
      socketOptions:
        keepAlive: 1
        connectTimeoutMS : 30000

  mongoDb.connect config.mongoUri, mongoOptions, (err, db) ->
    if err?
      console.log 'Could not connect: '
      console.log err
    else
      mongoose.connect config.mongoUri, mongoOptions

  app = express()

  app.configure ->   
    #app.use '/app', express.static(__dirname + '../../client/app')
    app.get '/', (req, res) ->
      res.redirect '/app/index.html'

    app.use '/app', express.static('../../client/app')
    app.use express.bodyParser()
    app.use cors
    app.use app.router

  db = mongoose.connection

  db.on 'error', console.error.bind console, 'connection error:'
  db.once 'open', ->
    app.listen config.port, ->
      #console.log "Express server listening on port " + config.port

  db.disconnect

  auth = express.basicAuth(config.user, config.password)
  
  service = new (require('./service'))

  app.get config.entryRoute, (req, res) ->
    if not req.query.id?
      service.findAll (err, result) ->
        renderQueryResult res, err, result
    else
      service.findById req.query.id, (err, result) ->
        rv = JSON.stringify result
        rv = JSON.parse rv
        delete rv._id
        delete rv.docVersion
        renderQueryResult res, err, rv

  app.put config.entryRoute, auth, (req, res) ->
    return unless req.body?
    service.put req.body, (err) ->
      if err?
        handleError res, err
      else         
        res.send {status: 200, message: 'Successfully updated entry'}

  app.get '/:id', (req, res) ->
    res.redirect '/app/index.html#/Details/' + req.params.id

  return app

module.exports = createServer