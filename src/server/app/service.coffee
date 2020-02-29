AppCatalogEntry = require './appCatalogEntry'

class AppCatalogService
  constructor: (@appCatalogEntry=null)->
    if not @appCatalogEntry?
      @appCatalogEntry = AppCatalogEntry

  #search for all available AppCatalogEntries
  findAll: (callback) ->
    @appCatalogEntry.find {}, '', (err, result) ->
      callback err, result

  #search for a single AppCatallogEntry by id
  findById: (id, callback) ->
    @appCatalogEntry.findOne { 'id': id }, '', callback

  put: (body, callback) ->
    try
      @appCatalogEntry.validate body, (errs) =>
        if errs?
          callback errs
        else
          entry = new @appCatalogEntry(body)
          @appCatalogEntry.updateOne {'id': body.id}, {$set: body, $inc: docVersion: 1}, {upsert: true}, (err, data) ->
            callback err
    catch ex
      callback ex  

module.exports = AppCatalogService