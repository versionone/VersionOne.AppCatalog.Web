express = require 'express'
mongoose = require 'mongoose'
cors = (require './cors').cors
nconf = require 'nconf'

createServer = (settings) ->
  mongoose.connect settings.mongoUrl
  
  app = express()
  
  app.configure ->   
    app.use '/app', express.static(__dirname + '/angular/app')
    app.use express.bodyParser()
    app.use cors
    app.use app.router

  db = mongoose.connection

  db.on 'error', console.error.bind console, 'connection error:'
  db.once 'open', ->
    port = process.env.PORT || settings.localPort
    app.listen port, ->
      console.log "Express server listening on port " + port

  db.disconnect

  nconf.file('auth.json').env()

  user = nconf.get 'user'
  password = nconf.get 'password'

  auth = express.basicAuth(user, password)

  service = require './service'

  app.get settings.entryRoute, (req, res) ->
    if not req.query.id?
      service.findAll (err, result) ->
        renderQueryResult res, err, result
    else
      service.findById req.query.id, (err, result) ->
        renderQueryResult res, err, result

  app.put settings.entryRoute, auth, (req, res) ->
    return unless req.body?
    service.put req.body, (err) ->
      if err?
        handleError res, err
      else         
        res.send {status: 200, message: 'Successfully updated entry'}

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

  return app

module.exports = createServer