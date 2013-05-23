AppCatalogEntry = require './appCatalogEntry'

#search for all available AppCatalogEntries
findAll = (callback) ->
  AppCatalogEntry.find {}, '', (err, result) ->
    callback err, result

#search for a single AppCatallogEntry by id
findById = (id, callback) ->
  AppCatalogEntry.findOne { 'id': id }, '', callback

put = (body, callback) ->
  try
    AppCatalogEntry.validate body, (errs) ->
      if errs?
        callback errs
      else
        entry = new AppCatalogEntry body
        AppCatalogEntry.update {'id': body.id}, {$set: body, $inc: docVersion: 1}, {upsert: true}, (err, data) ->
          callback err
  catch ex
    callback ex
        
service = 
  Model: AppCatalogEntry
  findAll: findAll
  findById: findById
  put: put

module.exports = service