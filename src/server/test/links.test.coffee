requireCover = require('./requireCover')('app')
fs = require 'fs'
request = require 'supertest'
server = requireCover 'serverClass'
should = require 'should'
testData = requireCover 'testData'
config = requireCover 'config'
jp = require('JSONPath').eval
req = require("request")

# Run server
app = server()

checkLinkReturns200 = (url, linkRequestComplete) ->
  req
    uri: url
    method: "GET"
  , (err, res, body) ->
    if err?
      console.log 'Error: '
      console.dir err      
    else
      if res.statusCode is 200
        console.log "200 OK for: #{url}"
      else
        console.log "#{res.statusCode} NOT OK for: #{url}"
    linkRequestComplete()

describe "Link checking", -> 
  it 'works well...', (done) -> 
    @timeout(180000)
    req
      uri: 'http://v1appcatalog.azurewebsites.net/entry',
      method: 'GET'
    , (err, res, body) ->
      if err?
        console.log 'Could not even get the App Catalog data!'
        done()
      else
        data = JSON.parse body
        errors = []
        urls = []
        for path in ['href', 'downloadUrl', 'moreInfoUrl', 'thumbhref']
          urls.push jp(data, '$..' + path)...

        count = urls.length * 1
        
        linkRequestComplete = ->
          count--
          console.log 'Count: ' + count
          if count == 0
            console.log 'Apparently done...' + count
            done()
        
        for url in urls 
          #checkSiteReturns404ForBadLink url, linkRequestComplete      
          checkLinkReturns200 url, linkRequestComplete


'''
it 'gets the list data and all links are valid', (done) ->
describe 'GET /entry returns all entries', ->
  it 'gets the list data and all links are valid', (done) ->
    req
      uri: 'http://v1appcatalog.azurewebsites.net/entry',
      method: 'GET'
    , (err, res, body) ->
      if err?
        console.log 'Could not even get the App Catalog data!'
        done()
      else
        data = JSON.parse body
        errors = []
        urls = []
        for path in ['href', 'downloadUrl', 'moreInfoUrl', 'thumbhref']
          urls.push jp(data, '$..' + path)...
        
        count = urls.length * 1
        
        linkRequestComplete = ->
          count--
          console.log 'Count: ' + count
          if count == 0
            console.log 'Apparently done...' + count
            done()

        for url in urls 
          #checkSiteReturns404ForBadLink url, linkRequestComplete
          checkLinkReturns200 url, linkRequestComplete
'''          