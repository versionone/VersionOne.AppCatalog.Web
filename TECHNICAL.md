# Technical Details

App Catalog is comprised of several major parts:

* Gherkin Feature files describing the original intentions for the system scenarios (not used for automation)
* UI built with AngularJS
* Karma and Jasmin provide client-side testing
* REST service made with Node.js, Express, and hosted on Windows Azure
* Document storage in MongoDB, hosted on MongoLab, and abstracted by Mongoose.js and a bit of JSON Schema
* Mocha and Sinon for server-side testing
* JSCoverage and the Cobertura and Test Anything Protocol (TAP) Jenkins plugins for code coverage reports

There is a lot to cover, so let's start by looking at one of the Gherkin files, and then follow the path of two kinds
of users, a pulisher, and a site visitor, following the execution all the way down to MongoDB.

After that, we'll look more closely at the Jenkins configuration and the physical deployment of the system.

The remaining details will zoom into interesting technical details about different parts like testing and AngularJS.

# How to Publish an Entry

Using cURL, you can PUT a catalog entry into the catalog if you specify the password like so:

```bash
curl -X PUT http://appcatalogstage.azurewebsites.net --user catUser:CatsRUs @product.json -H "Content-Type: application/json"
```
# Deep dive on Publish an Entry

The `product.json` file must contain JSON that conforms to the JSON Schema defined in [appCatalogEntry.coffee](https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/src/server/app/appCatalogEntry.coffee#L64). Here's an excerpt of the [TFS example entry](https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/src/server/test/examples/tfs.product.json):

```json
{
    "id": "VersionOne.V1TFS",
    "titleSection": {
        "name": "V1TFS",
        "shortDescription": "Links VersionOne Workitems to TFS Check-ins and Builds.",
        "pricing": "Free",
        "support": {
            "text": "VersionOne",
            "href": "http://support.versionone.com/home"
        }
    },
    "descriptionSection": {
        "description": "V1TFS links VersionOne Workitems to TFS Check-ins and Builds. The link from Workitems to Check-ins makes it easier to track down the source of a defect and perform code reviews. The link from Workitems to Builds enables teams to measure progress in terms of working software and to identify problems sooner. Using the links from Workitems to Builds, the VersionOne BuildRun Report can help a Release Manager select an appropriate build for release and can be the starting point for release notes."
    },
    "linksSection": [
        {
            "type": "download",
            "title": "Download Latest Stable Build",
            "href": "http://platform.versionone.com.s3.amazonaws.com/downloads/V1TFS2012.zip"
        },
        {
            "type": "source",
            "title": "Source Code",
            "href": "https://github.com/versionone/V1TFS"
        }
    ],
    "updatesSection": {
        "updates": [
            {
                "date": "2012-11-01T00:00:00.000Z",
                "description": "Fall 2012",
                "version": "97",
                "releaseNotes": "Added: Support for TFS 2012",
                "qualityBand": "sapling",
                "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/V1TFS2012.zip"
            },
            {
                "date": "2010-11-14T00:00:00.000Z",
                "description": "Initial Release",
                "version": "52",
                "qualityBand": "sapling"
            }
        ],
        "qualityBands": [
            {
                "name": "seed",
                "shortDesc": "The initial idea of a product. No working code.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#seed"
            },
            {
                "name": "sapling",
                "shortDesc": "The product is undergoing rapid growth. The code works but expect major changes.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#sapling"
            },
            {
                "name": "mature",
                "shortDesc": "The product is stable. The code will continue to evolve with minimum breaking changes.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#mature"
            }
        ]
    },
    "mediaSection": [
        {
            "title": "TFS Integration",
            "caption": "Integrate code check-ins and builds created by Microsoft's Team Foundation Server into VersionOne.",
            "mimetype": "video/x-flv",
            "href": "http://vtv.v1host.com/permalink/?title=SCM%20%26%20Build%3A%20Microsoft%20TFS&category=Integrations&edition=enterprise&release=undefined",
            "thumbhref": "http://community.versionone.com/attachments/imagefolder/gettingstarted/video.png"
        }
    ]
}
```
## JSON Schema excerpt

Below is an excerpt from the full schema. JSON Schema has an interesting structure. It's mostly straight-forward,
though notice that in the definition of `updatesSection\updates` that the list of `required` properties is separated out from the definition of properties themselves. I still am not exactly sure why they redesigned it this way, because earlier version of JSON Schema appeared to let you define a property as required in-line.

Also notice `qualityBands\patternProperties`. This allows you specify a regular expression that all property names of the object must match. The adjacent `minProperties: 1` means that the object must contain **at least one property**. Now, each of the properties themselves must be of type `object` and conform to the schema defined for it.

```coffee
updatesSection:
	type: 'object'
	required: ['updates', 'qualityBands']
	properties:
		updates:
		  type: 'array'
		  items:
		    type: 'object'
		    required: ['date', 'description', 'version']
		    properties:
		      date:
		        type: 'string'
		        format: 'date-time'
		        maxLength: 100
		      description:
		        type: 'string'
		        maxLength: 1000
		      version:
		        type: 'string'
		        maxLength: 50
		      releaseNotes:
		        type: 'string'
		        maxLength: 1000
		      moreInfoUrl:
		        type: 'string'
		        maxLength: HREF_MAX_LENGTH
		      qualityBand:
		        type: 'string'
		        maxLength: 50
		      downloadUrl:
		        type: 'string'
		        maxLength: HREF_MAX_LENGTH
qualityBands:
	minProperties: 1
	patternProperties:
		"^.*$":
		  type: 'object'
		  required: ['name', 'shortDescription', 'href']
		  properties:
		    name:
		      type: 'string'
		      maxLength: 100
		    shortDescription:
		      type: 'string'
		      maxLength: SHORT_DESCRIPTION_MAX_LENGTH
		    href:
		      type: 'string'
		      maxLength: HREF_MAX_LENGTH
```

## Node.js Express-based web service

The Node.js web service is based on Express, and uses a couple of useful features to simultaneously serve the static HTML and handle the
service requests for the catalog API. Express is based on the [Connect
middleware for Node.js](http://www.senchalabs.org/connect/), which afford the easy-to-extend pipeline model for 
constructing a web server that does `just enough` with very little 
overhead.

```coffee
  express = require 'express'
  mongoose = require 'mongoose'
  cors = (require './cors').cors
  config = require './config'

  # ...

  app = express()

  app.configure ->   
    app.use '/app', express.static('../../client/app')
    app.use express.bodyParser()
    app.use cors
    app.use app.router

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

  return app
```

### Configuration

* First, we create an actual web server instance with the line `app = express()`, and then we configure the request pipeline. Each `app.use` call shapes the pipeline in some way.
* `app.use '/app', express.static('../../client/app')` instructs Express to serve everything under the relative path `../../client/app` as plain old static content accessible via the `/app` route.
* `express.bodyParser` makes it convert incoming requests (that don't get handled by the `/app` static handler) to JSON bodies. Actually, it supports url-encoded, and multi-part forms as well, but tries JSON first.
* `cors` is a module we wrote ourselves to ensure properly Cross-origin resource sharing support -- explained later.
* Finally, `app.router` mounts the actual `/app` and `/entry` routes immediately, instead of waiting for the first request from a client to do so.

### Security

The line `auth = express.basicAuth(config.user, config.password)` creates a basic authentication helper, which we'll then attach, but only in front of the `PUT` handler.

### Route handlers

We define two handlers for the `/entry` route, one for `GET`, and one for `PUT`. We'll skip the details on `GET` for now because we're focusing this dive on publishing an entry, which involves `PUT`.

The `PUT` handler is quite small:

```coffee
app.put config.entryRoute, auth, (req, res) ->
    return unless req.body?
    service.put req.body, (err) ->
      if err?
        handleError res, err
      else         
        res.send {status: 200, message: 'Successfully updated entry'}
```		

* If no body exists, simply return
* Otherwise, delegate to the `service.put` function. The `service` object does the real work, so we'll see it in a second.
* Since most operations in Node.js are asynchronous, including all the work happening behind the scenes with MongoDB in this situation, we pass in a callback that will eventually get called. If no error exists, we send a simple JSON response message to the client.

## Web service tests

Web service tests are in `test/server.tests.coffee`. These are end-to-end service tests that instantiate the web server and point at a real, locally running, MongoDB instance. We'll explain what the `requireCover` module does when we talk about code coverage and Jenkins. For now, let's just look at one of the more interesting tests:

```coffee
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
```

Perhaps there's a better way to do this with Mocha that would not require the callback tracking. There's got to be. This reads sample files that @ianbuchanan has created based on real products. Each file should successfully PUT to the server, pass validation, and get saved into a locally running MongoDB. Unfortunately the way I wrote this, it's hard to see which one failed without scrolling up. So, I'd like to have each file be an independent test. I suppose simply looping and calling `describe` and `it` in the loop might work.

## Application service interacts with Mongoose (and thus MongoLab and MongoDB)

The web service doesn't try to do too much. It delegates most of the *real work* to the application service. This class itself is small, and largely builds upon the facilities of Mongoose. The whole module fits easily in a snippet:

```coffee
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
          @appCatalogEntry.update {'id': body.id}, {$set: body, $inc: docVersion: 1}, {upsert: true}, (err, data) ->
            callback err
    catch ex
      callback ex  

module.exports = AppCatalogService
```
* We talked briefly about `AppCatalogEntry` before. It's where the JSON Schema is that defines what the catalog entry document must resemble.
* The constructor for the service actually except an optional parameter to use within. This gets uses as a containerless form of dependency injection that helps with isolating unit tests, as we'll see soon.
* Before we see that, let's dive now into the actual validation logic that gets called when we invoke the class-level function `@appCatalog.validate`.

## The fun stuff: helper libraries to ease validation

This is where it actually gets fun, codewise.

First, these are the requires in `appCatalogEntry.coffee`:

```coffee
mongoose = require 'mongoose'
jayschema = require 'jayschema'
js = new jayschema jayschema.loaders.http
uri = require 'uri-js'
validator = require('validator').Validator
jp = require('JSONPath').eval
_ = require 'underscore'
```

* `mongoose` is a very popular abstraction library over MongoDB that makes it easier to use.
* `jayschema` is an implementation of JSON Schema
* `js` is an instance of `jayschema` that can load schema definitions via HTTP
* `uri-js` helps parse URIs properly (better than fake, brittle regex junk)
* `validator` is a great validation module
* `JSONPath` provides simple XPath-like selection and filtering over a JavaScript object in memory or JSON document on disk.
* `_` needs little introduction, right?

Here's the actual `validate` function:

```coffee
validator::error = (msg) ->
    @_errors.push(msg)
    return @

validator::getErrors = () ->
    return @_errors;

AppCatalogEntry.validate = (data, callback) ->
  js.validate data, jsonSchema, (errs) ->
    if errs
      callback(errs)
    else
      # Validate URL types        
      errors = []
      urls = []
      for path in ['href', 'downloadUrl', 'moreInfoUrl', 'thumbhref']
        urls.push jp(data, '$..' + path)...
      for url in urls
        va = new validator()
        va.check(url).isUrl()
        validatorErrors = va.getErrors()
        if validatorErrors.length > 0
          errors.push
            href: url
            errors: validatorErrors
      
      # Ensure no update refers to any nonexistent qualityBand
      specifiedQualityBandNamesInUpdates = jp(data, '$..updates..qualityBand')      
      allowableQualityBandsNames = _.keys jp(data, '$..qualityBands')[0]
      for rogue in _.difference(specifiedQualityBandNamesInUpdates, allowableQualityBandsNames)
        errors.push 'The qualityBand ' + rogue + ' does not exist in the updates/qualityBands section. Available bands are: ' + 
          allowableQualityBandsNames.join(', ')

      # return errors or empty
      if errors.length > 0
        callback errors
      else
        callback null
```

* First, we override some 'class level' function in Validator
* Then, check for any validation errors that come purely from JSON Schema violations, with the call to `js.validate data, jsonSchema`
* If that passes, we need to do more sophisticated validation that cannot occur by JSON Schema alone. This is where JSONPath saves the day.
* The array `['href', 'downloadUrl', 'moreInfoUrl', 'thumbhref']` is a list of property names that, regardless of where they appear in the document graph, must be a valid URI.
* This line: `jp(data, '$..href')...` first uses JSONPath to fetch **all** properties named `href` in the document, starting at the root. It's kind of like an XPath that does `//[@href]` or something like that. 
* The **`...`** is not a mistake. That's CoffeeScript's **splat** operator. It converts the return value from `jp()` into multiple arguments, which is what `Array.push` takes. I'll drink to that.
* So, once we have all the properties that must be valid URIs, we validate them with the `uri-js` module instance, and we're good.
* Unless, of course, those crazy catalog entry authors have put **qualityBand** entries that don't actually exist into an **update**. The line `jp(data, '$..updates..qualityBand')` fetches all qualityBand properties underneath the updates section.
* Finally, we use Underscore's handy `difference` function to determine whether a rogue qualityBand exists in any of the updates.

## Mongoose / MongoDB upserts

Now that we're past validation, let's look at this chunk of code again:

```coffee
@appCatalogEntry.update {'id': body.id}, {$set: body, $inc: docVersion: 1}, {upsert: true}, (err, data) ->
    callback err
```

I didn't find the documentation in the Mongoose documentation, but did [find help on Stackoverflow](http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose). This line will:

* Find the document with `id = body.id`
* And, if found, reset its content to `body`
* Or, if not found, it will create a new document with that id.
* The `$inc: docVersion: 1` instructs Mongoose to increment the `docVersion` property of the document by one.

# Enter MongoLab

MongoLab describes itself as:

> MongoDB-as-a-Service: Power your app with the most widely-deployed cloud database in the world.

That's really the most important fact about this part. It's MongoDB. It's hosted in MongoLab's cloud.

Connecting to it is facilitated by a standard MongoDB connection string, like this:

`config.mongoUri = 'mongodb://appcatalog:passwordGoesHere@ds065917.mongolab.com:61787/appcatalogstage'`

And, finally, we tell Mongoose to connect to this by passing the string from the configuration:

`mongoose.connect config.mongoUri`

Databases and documents can be managed fully inside of a web-based interface on MongoLab's site, and they also have their own [REST API](https://support.mongolab.com/entries/20433053-REST-API-for-MongoDB) on top of the standard MongoDB API. Our application is not using that, however, since we connect to MongoLab via our REST service running in Azure.

The reason for this is that the MongoLab API is not customizable, so we cannot do the custom validation and such that is necessary to ensure data integrity.



