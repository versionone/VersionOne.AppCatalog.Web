# Technical Details

App Catalog is 100% JavaScript / CoffeeScript. In this document, I'll highlight details of the full
technical implementation, deployment, and build process. We'll start at the command line to learn how to
add an or update an entry in the App Catalog with cURL. We'll then zoom all the way into the server-side details, then
resurface at the web UI, and dig into how the front-end is built with AngularJS and Twitter Bootstrap.

Along the way we'll see how the unit, integration, and end-to-end tests work, and how the site is hosted in
Windows Azure and MongoLab. Finally, we'll see how the Jenkins build process works, including JS code-coverage
and continuous deployment to Azure via GitHub integration.

# Table of Contents

## Command line scenario

* How to Publish an Entry
* Deep dive on Publish an Entry

## Catalog entry schema

* JSON Schema excerpt
  * Schema tests

## Web service

* Node.js Express-based web service
  * Configuration
  * Security
  * Route handlers
  * Web service tests
* Application service with Mongoose, MongoLab, MongoDB
  * Application service tests with SinonJS and code coverage
* The fun stuff: helper libraries to ease validation
  * Testing custom URL and qualityBand validation
  * Mongoose / MongoDB upserts

## Data storage

* Enter MongoLab
  * MongoLab edit document admin page

## Application hosting

* Configuration and service hosting in Windows Azure
  * Built-in support for Node.js
  * Tight integration with GitHub for continuous deployment on push to branch
  * Dashboard, monitoring, logs, and FTP access

## Front-end

* GET into the AngularJS world
 * AngularJS mini tutorial
 * The simplest app that could possibly work works better than you'd think
 * AngularJS HTML app template
 * Angular basics
 * More about futures
 * A heavier introduction to AngularJS
* How App Catalog is built on AngularJS
 * GET handler for /entry web service route
 * App shell from the Angular team's angular-seed project on GitHub
 * Aside: better modularity with AngularJS apps
 * Application routes
 * DetailsCtrl controller
 * App service for consuming the /entry web service route
 * Details partial template
 * The updates directive and Markdown support
 * Updates directive template
 * Testing is good Karma
 * Debunking AngularJS vs. Backbone myths

## Jenkins build

* Jenkins job with JavaScript code coverage
 * Test Anything Protocol report
 * JSCoverage for line-by-line coverage
   * Covered code example
   * Coverage report
 * Cobertura plugin for code coverage summary

# How to Publish an Entry

Using cURL, you can PUT a catalog entry into the catalog if you specify the password like so:

```bash
curl -X PUT http://appcatalogstage.azurewebsites.net/entry --user catUser:CatsAreUs -d @product.json -H "Content-Type: application/json"
```
# Deep dive on Publish an Entry

The `product.json` file must contain JSON that conforms to the JSON Schema defined in [appCatalogEntry.coffee](https://github.com/versionone/VersionOne.AppCatalog.Web/blob/master/src/server/app/appCatalogEntry.coffee#L64). Here's an excerpt of the [TFS example entry](https://github.com/versionone/VersionOne.Integration.VSTFS/blob/master/product.json):

```json
{
    "id": "VersionOne.Integration.VSTFS",
    "titleSection": {
        "name": "VersionOne Integration for Team Foundation Server",
        "shortDescription": "Links VersionOne Workitems to TFS Check-ins and Builds.",
        "pricing": "Free",
        "support": {
            "text": "VersionOne",
            "href": "http://support.versionone.com/home"
        }
    },
    "descriptionSection": {
        "description": "VersionOne Integration for Team Foundation Server links VersionOne Workitems to TFS Check-ins and Builds. The link from Workitems to Check-ins makes it easier to track down the source of a defect and perform code reviews. The link from Workitems to Builds enables teams to measure progress in terms of working software and to identify problems sooner. Using the links from Workitems to Builds, the VersionOne BuildRun Report can help a Release Manager select an appropriate build for release and can be the starting point for release notes."
    },
    "linksSection": [
        {
            "type": "download",
            "title": "Download Latest Stable Build",
            "href": "http://platform.versionone.com.s3.amazonaws.com/downloads/VersionOne.Integration.VSTFS_4.0.0.472.zip"
        },
        {
            "type": "documentation",
            "title": "Documentation",
            "href": "http://versionone.github.io/VersionOne.Integration.VSTFS"
        },
        {
            "type": "documentation",
            "title": "README",
            "href": "https://github.com/versionone/VersionOne.Integration.VSTFS/blob/master/README.md"
        },
        {
            "type": "source",
            "title": "GitHub Project for Source Code and Issues",
            "href": "https://github.com/versionone/VersionOne.Integration.VSTFS"
        },
        {
            "type": "license",
            "title": "Modified BSD (3-clause) License",
            "href": "https://github.com/versionone/VersionOne.Integration.VSTFS/blob/master/LICENSE.md"
        }
    ],
    "updatesSection": {
        "updates": [
            {
                "date": "2014-05-16T00:00:00.000Z",
                "description": "Spring 2014",
                "version": "4.0.0.475",
                "releaseNotes": "Added: Listener now works with TFS 2013",
                "qualityBand": "sapling",
                "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/VersionOne.Integration.VSTFS_4.0.0.475.zip"
            },
            {
                "date": "2012-11-01T00:00:00.000Z",
                "description": "Fall 2012",
                "version": "97",
                "releaseNotes": "Added: Support for TFS 2012",
                "qualityBand": "sapling",
                "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/V1TFS2012.zip"
            },
            {
                "date": "2012-08-08T00:00:00.000Z",
                "description": "Fall 2012",
                "version": "96",
                "releaseNotes": "Fixed: Performance problems exacerbated by unclosed sprints.",
                "qualityBand": "sapling"
            },
            {
                "date": "2011-07-01T00:00:00.000Z",
                "description": "Summer 2011",
                "version": "64",
                "releaseNotes": " * Added: Support for connecting to VersionOne through a proxy.\n * Added: Support for TFS 2010 SP1",
                "qualityBand": "sapling"
            },
            {
                "date": "2010-11-14T00:00:00.000Z",
                "description": "Initial Release",
                "version": "52",
                "qualityBand": "sapling"
            }
        ],
        "qualityBands": {
            "seed": {
                "shortDescription": "The initial idea of a product. No working code.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#seed"
            },
            "sapling": {
                "shortDescription": "The product is undergoing rapid growth. The code works but expect major changes.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#sapling"
            },
            "mature": {
                "shortDescription": "The product is stable. The code will continue to evolve with minimum breaking changes.",
                "href": "https://github.com/versionone/V1TFS/blob/master/CONTRIBUTING.md#mature"
            }
        }
    },
    "mediaSection": [
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
		  required: ['shortDescription', 'href']
		  properties:
		    shortDescription:
		      type: 'string'
		      maxLength: SHORT_DESCRIPTION_MAX_LENGTH
		    href:
		      type: 'string'
		      maxLength: HREF_MAX_LENGTH
```

## Schema tests

To verify that the schema and the associated custom validation code works, we have a test suite that verifies each
restriction. This is important for a number of reasons. First of all, JavaScript is a dynamic language that has
nothing in terms of compile-time type-safety, and even at runtime its dynamic nature is very free-form. Second,
because we want to have the freedom to modify the internal implementation of the validation,
without the fear that doing so would break the system. By having comprehensive unit tests for our implementation
we have this confidence.

Here are a couple of examples that aim to be self-explanatory:

```coffee
  test 'fails on invalid types for titleSection', ->
    entry = fullyValidEntry()
    entry.titleSection = {
      name: 0,
      shortDescription: 0,
      pricing: 0,
      support: 0
    }
    entry
  , expectTypesInvalid,
    '#/titleSection/name': 'string'
    '#/titleSection/shortDescription': 'string'
    '#/titleSection/pricing': 'string'
    '#/titleSection/support': 'object'

  test 'fails when a titleSection properties exceed maxLength', ->
    entry = fullyValidEntry()
    entry.titleSection = {
      name: exceed(100),
      shortDescription: exceed(SHORT_DESCRIPTION_MAX_LENGTH),
      pricing: exceed(50),
      support: {
        text: exceed(100),
        href: exceed(1000)
      }
    }
    entry
  , expectMaxLengthsExceeded,
    '#/titleSection/name': 100
    '#/titleSection/shortDescription': SHORT_DESCRIPTION_MAX_LENGTH
    '#/titleSection/pricing': 50
    '#/titleSection/support/text': 100
    '#/titleSection/support/href': 1000
```

We'll examine the tests for the custom URL and qualityBand validation later after we look at the web service.

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

Perhaps there's a better way to do this with Mocha that would not require the callback tracking.
There's got to be. This reads sample files that @ianbuchanan has created based on real products.
Each file should successfully PUT to the server, pass validation, and get saved into a locally running MongoDB.
Unfortunately the way I wrote this, it's hard to see which one failed without scrolling up.
So, I'd like to have each file be an independent test. I suppose simply looping and calling `describe` and `it` in
the loop might work.

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
* We talked briefly about `AppCatalogEntry` before. It's where the JSON Schema is that defines what the catalog
entry document must resemble.
* The constructor for the service accepts an optional parameter to use within. This acts like a
containerless form of dependency injection that helps with isolating unit tests, as we'll see soon.
* Before we see that, let's dive now into the actual validation logic that gets called when we invoke the
class-level function `@appCatalog.validate`.

## Application service tests with SinonJS and code coverage

The application service class we just examined has a dependency on Mongoose. Mongoose depends on a running
instance of MongoDB to execute. At the unit level or integration level, we don't want to test our service class
with the real data. Instead, we verify that an instance of our class, when passed certain inputs, makes the correct
calls into its injected dependencies. We used Sinon.JS to achieve this as follows:

```coffee
requireCover = require('./requireCover')('app')
should = require 'should'
sinon = require 'sinon'

must = (name, mock, configCallback) ->
	it name, (done) ->
		configCallback()
		mock.verify()
		mock.restore()
		done()

# Declare the external dependencies as a mock object, in this case just
# stating the raw facts that it has three functional-level 'class functions'.
# We don't even care what the arguments are, really, because sinon will help
# us verify the correct arguments later. Also mock out the constructor and the
# save instance method to help verify behavior
class MockAppCatalogEntry
	this.currentInstance = {}
	constructor: (body) ->
		@id = body.id
		MockAppCatalogEntry.currentInstance = @
	save: sinon.spy()
	this.find = ->
	this.findOne = ->
	this.update = ->
	this.validate = ->

# Note: the goofy thing here is that when you call sinon.mock,
# it modifies the target object in place, but returns you the
# mock definition, which is where you actually set up your
# expectations. But, you still consume the original object.
# I guess.
mock = sinon.mock MockAppCatalogEntry

# Our actual subject under test is the service class
svc = requireCover 'service'

describe 'service', ->

	describe '#findAll', ->
		subject = new svc(MockAppCatalogEntry)
		must 'call find', mock, ->
			mock.expects('find').once().withArgs {}, ''
			subject.findAll()

	describe '#findById', ->
		subject = new svc(MockAppCatalogEntry)
		must 'call findOne', mock, ->
			id = 'v1clarityppm'
			mock.expects('findOne').once().withArgs { id: id }, ''
			subject.findById id

	describe '#put', ->
		subject = new svc(MockAppCatalogEntry)
		must 'call validate and update', mock, ->
			id = 'v1clarityppm'
			body = {id: id}
			mock.expects('validate')
				.once()
				.withArgs(body)
				.callsArg(1)
			mock.expects('update')
				.once()
				.withArgs(body, {$set: {id:id}, $inc: docVersion: 1}, {upsert: true})
				.callsArg(3)
			subject.put body, (err) ->

```

You can learn more about Sinon's features at [its web site](http://sinonjs.org/). It provides most of the features
you've come to know, and enjoy, in such tools as Moq in the .NET world.

The `requireCover` module does this:

```coffee
module.exports = (appName, envVarCoverageToggleName='', pathToRawFiles='', pathToCoveredFiles='') ->
    return (moduleName) ->
      envVarCoverageToggleName = "#{appName}_cov" if envVarCoverageToggleName is ''
      pathToRawFiles = "../#{appName}" if pathToRawFiles is ''
      pathToCoveredFiles = "../#{appName}_cov" if pathToCoveredFiles is ''
      modulesPath = if process.env[envVarCoverageToggleName]? then pathToCoveredFiles else pathToRawFiles
      modulePath = "#{modulesPath}/#{moduleName}"
      return require(modulePath)
```

We'll examine this in depth when we cover the Jenkins job and code coverages, but what this does is to load
dependencies from an alternatve, "covered", folder when running under test with code-coverage.
We cover Jenkins at the end of this document.

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
        validUrl = validator.isUrl(validator.trim(url))
        if (!validUrl)
          errors.push({ href: url, errors : ["Not a valid url"] })

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

* First, we override some 'class level' functions in Validator
* Then, check for any validation errors that come purely from JSON Schema violations, with the call to
`js.validate data, jsonSchema`
* If that passes, we need to do more sophisticated validation that cannot occur by JSON Schema alone.
This is where that bad boy JSONPath saves the day.
* The array `['href', 'downloadUrl', 'moreInfoUrl', 'thumbhref']` is a list of property names that,
regardless of where they appear in the document graph, must be a valid URI.
* This line: `jp(data, '$..href')...` first uses JSONPath to fetch **all** properties named `href` in the document,
starting at the root. It's kind of like an XPath that does `//[@href]` or something like that.
* The `...` is not a mistake. That's CoffeeScript's **splat** operator. It converts the return value
from `jp()` into multiple arguments, which is what `Array.push` takes. I'll drink to that.
* So, once we have all the properties that must be valid URIs, we validate them with the `uri-js` module instance,
and we're good.
* Unless, of course, those crazy catalog entry authors have put **qualityBand** entries that don't actually exist
into an **update**. The line `jp(data, '$..updates..qualityBand')` fetches all qualityBand properties underneath
the updates section.
* Finally, we use Underscore's handy `difference` function to determine whether a rogue qualityBand exists in
any of the updates.

## Testing the custom URL and qualityBand validation

Here are some snippets from the unit tests for URLs and qualityBand info:

```coffee
describe 'AppCatalogEntry: updatesSection/qualityBands', ->
  test 'fails when qualityBands has fewer than 1 property', ->
    entry = fullyValidEntry()
    entry.updatesSection.qualityBands = {}
    entry
  , expectMinPropertiesNotMet,
    '#/updatesSection/qualityBands' : 1

  test 'fails when a qualityBand is missing required properties', ->
    entry = fullyValidEntry()
    entry.updatesSection.qualityBands.sapling = {}
    entry
  , expectPropertiesMissing,
    '#/updatesSection/qualityBands/sapling': [
      'shortDescription'
    ]

  test 'fails when a qualityBand has invalid types', ->
    entry = fullyValidEntry()
    entry.updatesSection.qualityBands.sapling =
      shortDescription: 0
      href: 0
    entry
  , expectTypesInvalid,
    '#/updatesSection/qualityBands/sapling/shortDescription': 'string'
    '#/updatesSection/qualityBands/sapling/href': 'string'

  test 'fails when a qualityBand properties exceed maxLength', ->
    entry = fullyValidEntry()
    entry.updatesSection.qualityBands.sapling =
      shortDescription: ex(SHORT_DESCRIPTION_MAX_LENGTH)
      href: ex(HREF_MAX_LENGTH)
    entry
  , expectMaxLengthsExceeded,
    '#/updatesSection/qualityBands/sapling/shortDescription': SHORT_DESCRIPTION_MAX_LENGTH
    '#/updatesSection/qualityBands/sapling/href': HREF_MAX_LENGTH

  test 'fails on invalid href in a qualityBand', ->
    entry = fullyValidEntry()
    entry.updatesSection.qualityBands.sapling.href = 'not a url'
    entry
  , expectErrorsEqual,
    '0':
      href: 'not a url'
      errors: [
        'Invalid URL'
      ]

  test 'fails when an update refers to a non-existent qualityBand', ->
    entry = fullyValidEntry()
    entry.updatesSection.updates[0].qualityBand = 'perfect'
    entry
  , expectErrorsEqual,
    '0': 'The qualityBand perfect does not exist in the updates/qualityBands section. Available bands are: sapling, mature'

```

## Mongoose / MongoDB upserts

Now that we're past validation, let's look at this chunk of code again:

```coffee
@appCatalogEntry.update {'id': body.id}, {$set: body, $inc: docVersion: 1}, {upsert: true}, (err, data) ->
    callback err
```

I didn't find the documentation in the Mongoose documentation,
but did [find help on Stackoverflow](http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose).
This line will:

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

## MongoLab edit document admin page

Here's what the MongoLab site looks like when you want to manually edit a document:

![MongoLab edit document](./doc/images/technical/mongoLabEdit.png)


## Configuration and service hosting in Windows Azure

Having walked through the web service implementation, let's look at how the catalog is configured and
how it's hosted in Windows Azure.

It relies upon several Azure features to make it easy and reliable:

* Built-in support for Node.js
* Tight integration with GitHub for continous deployment on push to branch
* App settings exported as environment variables Node can read with nConf
* Dashboard, monitoring, logs, and FTP access

### Built-in support for Node.js

The Azure team has done great work to make developing with Node.js very easy. If you visit the
[Node.js developer center](http://www.windowsazure.com/en-us/develop/nodejs/) you'll see the first tutorial text
advertised as:

```bash
npm install azure
git commit -m "My first Node app"
git push azure master
```

There are lots of other very useful tutorials for getting your feet wet, and check out these resources for help:

* [Azure Forums](http://social.msdn.microsoft.com/Forums/en-US/category/windowsazureplatform)
* [Azure Channel on jabbr.net](https://jabbr.net/#/rooms/Azure) -- David Ebbo was particularly helpful along with a few
other people when we faced issues.

### Tight integration with GitHub for continuous deployment on push to branch

Not only is git in your local environment supported, but so is GitHub, as well as other cloud-hosted source control
repositories. This process was very easy when creating the site in the management console. Here's what it looks like:

#### Create a site with Custom Create option

![Create a site with Custom Create option](./doc/images/technical/azureCreateSite_01.png)

#### Specify site name and publish from source control

![Specify site name and publish from source control](./doc/images/technical/azureCreateSite_02.png)

#### Select GitHub as source code provider

![Select GitHub as source code provider](./doc/images/technical/azureCreateSite_03.png)

As of June, 2013, Azure integrates with:

* Team Foundation Service (cloud-hosted, or on-premise)
* Local Git repository
* GitHub
* Dropbox
* Bitbucket
* CodePlex
* External repository

#### Select a GitHub repository and a branch to publish

![Select a GitHub repository and a branch to publish](./doc/images/technical/azureCreateSite_04.png)

Note that you'll get to choose either a private repository from your account, or any of the repositories from any
organizations to which you belong.

### App settings exported as environment variables Node can read with nConf

Here's the `config.coffee` module:

```coffee
nconf = require 'nconf'

config = {}

configFile = 'config.json'

if process.env['config_file']?
  configFile = process.env['config_file']

nconf.file(configFile).env()

config.entryRoute = nconf.get('server_entryRoute') || '/entry'

config.port = nconf.get('server_localPort') || 8081
if process.env.PORT?
  config.port = process.env.PORT

config.mongoUri = nconf.get 'mongoDb_uri'
config.user = nconf.get 'server_auth_user'
config.password = nconf.get 'server_auth_password'

module.exports = config
```

The nconf module provides hierarchical configuration, sourcing from JSON disk files, environment variables, and more.
What's more, the line `nconf.file(configFile).env()` means this:

* Load settings from the file pointed to by `configFile`
* Load additional settings from environment variables. If an environment variable exists with the same name as a setting
from `configFile`, then **the environment variable will override it**.

This has made keeping a single code-base a snap, because we use environment variables for our Jenkins tests, which point
to a development version of the database in MongoLab, and a JSON config file when running tests locally, which points to
a local instance of MongoDB. And, when running in Azure, the settings get sourced from environment variables, which are
automatically populated from the app settings set in the management site console shown below.

#### App settings in Azure console

![App Settings in Azure console](./doc/images/technical/azureAppSettings.png)

All app settings values get populated into environment variables that Node.js can see.

Dave Ward's [post on this subject](http://encosia.com/using-nconf-and-azure-to-avoid-leaking-secrets-on-github/)
was extremely helfpul.

### Dashboard, monitoring, logs, and FTP access

This shows the variety of information and options for monitoring and accessing resources related to the site:

![Azure web site dashboard](./doc/images/technical/azureDashboard.png)


# GET into the AngularJS world

We've covered the web service implementation and the technical details of MongoLab and Azure. Now, let's get into the
best part: AngularJS on the front-end.

## AngularJS mini tutorial

AngularJS is a big subject, and we are definitely not fully utilizing it yet in the first iteration of the App Catalog.

At its core, AngularJS is a Model-View-ViewModel framework:

* Models are simple JavaScript objects, arrays, and built-in types.
* Views are standard HTML, along with a built-in Handlebars-like templating language, plus the optional capability to
create your own tags, like `<tabs><pane><h1>Hey I'm a tab with an H1 tag</h1></h2></pane></tabs>` or
`<carousel><frame>random <b>HTML</b> text</frame></carousel>`.
* ViewModels are collections of properties (including functions) that the HTML views can see and call.

## The simplest app that could possibly work works better than you'd think

This is from the main AngularJS web site:

```html
<!doctype html>
<html ng-app>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
  </head>
  <body>
    <div>
      <label>Name:</label>
      <input type="text" ng-model="yourName" placeholder="Enter a name here">
      <hr>
      <h1>Hello {{yourName}}!</h1>
    </div>
  </body>
</html>
```

What's happening here that's impressive?

* First of all, there is no "script-behind". The `input` tag has the custom `ng-model="yourName"` and the `h1` tag
has the Handlebarsy `{{yourName}}` expression.
* As soon as you start typing into the form, the two-way data-binding in Angular will cause the `h1` to update.
* No jQuery, no Handlebars, no event-handlers. It just works.

If you're the least bit interested, I encourage you to watch the 12-minute tutorial on YouTube that goes through their
entire front-page sample: [AngularJS Hello World](http://www.youtube.com/watch?feature=player_embedded&v=uFTFsKmkQnQ)


## AngularJS HTML app template

Aside from the hello world sample on the home page, there is a more in-depth tutorial, which begins with this
super simple shell for a single-page application:

```html
<html lang="en" ng-app="phonecat">
<head>
  <script src="lib/angular/angular.js"></script>
  <script src="js/app.js"></script>
  <script src="js/controllers.js"></script>
</head>
<body>

  <div ng-view></div>

</body>
</html>
```

The `ng-app="phonecat"` refers to an Angular module, which we'll see in a second. And, the `<div ng-view></div>`
stipulates where Angular will inject partial views in response to browser navigation requests.

## Angular basics

Angular lets you define route handlers to intercept the browser's navigation behavior and then route those paths to
controller classes and an associated HTML view template, like this:

```coffee
angular.module("phonecat", []).config ($routeProvider) ->
  $routeProvider.when("/phones",
    templateUrl: "partials/phone-list.html"
    controller: PhoneListCtrl
  ).when("/phones/:phoneId",
    templateUrl: "partials/phone-detail.html"
    controller: PhoneDetailCtrl
  ).otherwise redirectTo: "/phones"
```

The `$routeProvider` object is provided for you by Angular's dependency injection support. So, in this example,
if `/phones/iphone` were specified, then the app would probably delete your GMail account, since Google
created AngularJS! Actually, it would execute the `PhoneDetailCtrl` controller:

```coffee
PhoneDetailCtrl = ($scope, $routeParams, Phone) ->
  $scope.phone = Phone.get(
    phoneId: $routeParams.phoneId
  , (phone) ->
    $scope.mainImageUrl = phone.images[0]
  )
  $scope.setImage = (imageUrl) ->
    $scope.mainImageUrl = imageUrl

```

This code:

* Declares that the function take three depdency-injected parameters. `$scope` and `$routeParams` are built-in AngularJS
objects, while `Phone` is something custom to the example application.
* Uses the `Phone` object to issue an HTTP get and specify a callback for when it finishes. Technically, this callback
is only necessary because the code sets the `mainImageUrl` property to the first element in the images array. AngularJS
is smart enough that if we did not specify the callback, it would automatically update the DOM whenn the `future`, as
they call it, completes executing. This is pretty awesome. **See `More about futures` below for a snippet from the tutorial that explains this.**
* Finally, `setImage` is function that click handlers can invoke in the template.

Speaking of the template, AngularJS then renders the `partials/phone-detail.html` view in the placeholder of the application shell:

```html
<img ng-src="{{phone.images[0]}}" class="phone">

<h1>{{phone.name}}</h1>

<p>{{phone.description}}</p>

<ul class="phone-thumbs">
  <li ng-repeat="img in phone.images">
    <img ng-src="{{img}}">
  </li>
</ul>

<ul class="specs">
  <li>
    <span>Availability and Networks</span>
    <dl>
      <dt>Availability</dt>
      <dd ng-repeat="availability in phone.availability">{{availability}}</dd>
    </dl>
  </li>
    ...
  </li>
    <span>Additional Features</span>
    <dd>{{phone.additionalFeatures}}</dd>
  </li>
</ul>
```

All of the values specified in the `$scope` object by the controller function are visible without any prefix to the
HTML template.

I think it's important to note that the repeater syntax and variable interpolation blocks are very similar to Handlebars
and other template tools, but feel more natural because the HTML is still HTML. If you are afraid of the `ng-`, I believe
you can also use the standard HTML5 `data-` prefix. One strong benefit with AngularJS is that this templating is
built into the framework, not layered in as an external dependency.

## More about futures

Here's an excerpt from [step 11 in the Angular tutorial](http://docs.angularjs.org/tutorial/step_11) that explains
the future object concept:


> Notice how in PhoneListCtrl we replaced:

> ```javascript
> $http.get('phones/phones.json').success(function(data) {
>  $scope.phones = data;
> });
> ```
>
> with:
>
> ```javascript
> $scope.phones = Phone.query();
> ```
>
> This is a simple statement that we want to query for all phones.
>
> An important thing to notice in the code above is that we don't pass any callback functions when invoking methods of our Phone service. Although it looks as if the result were returned synchronously, that is not the case at all. What is returned synchronously is a "future" — an object, which will be filled with data when the XHR response returns. Because of the data-binding in Angular, we can use this future and bind it to our template. Then, when the data arrives, the view will automatically update.
>
> Sometimes, relying on the future object and data-binding alone is not sufficient to do everything we require, so in these cases, we can add a callback to process the server response. The PhoneDetailCtrl controller illustrates this by setting the mainImageUrl in a callback.


## A heavier introduction to AngularJS

The code above is actually from the [AngularJS Tutorial](http://docs.angularjs.org/tutorial).

Rather than recreating the wheel here, I recommend you check out the simple, interactive live examples on the
[home page](http://angularjs.org/), or even the official [AngularJS Tutorial](http://docs.angularjs.org/tutorial/) to
get a grasp of the major Angular concepts.

The best part about the tutorial is that it shows you how to create a **Phone Catalog**, with similar requirements to
App Catalog.

With that out of the way, however, let's look specifically at App Catalog's Angular code.

# How App Catalog is built on AngularJS

First, let's remember the service code for the `GET` handler in the catalog service, because this is the handler
that all the browser-facing scenarios use. Here it is:

## GET handler for `/entry` route

```coffee
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
```

This is really simple, and just delegates to the sevice class we've already looked at, which itself uses Mongoose's
built-in query API. Note that we do some JSON-wrangling after the `findById` call. That is to remove the
automatically-inserted `_id` and the `docVersion` property which conflict with the JSON schema. TODO: this is just a
self-inflicted conflict that can be removed in the next iteration.

## App shell from the Angular team's [angular-seed project](https://github.com/angular/angular-seed) on GitHub.

Based on the angular-seed project, here's the shell for the single page app:

```html
<!doctype html>
<html lang="en" ng-app="appCatalog">
<head>
  <meta charset="utf-8">
  <title>VersionOne App Catalog</title>
  <link rel="stylesheet" href="css/v1-custom-bootstrap.css" />
  <link rel='stylesheet' href='css/video-js.css' />
  <link rel='stylesheet' href='css/appcatalog.css' />
   <style>
        /* to show span element display we give each a background color. */
        .section { background-color: #eee; border-radius: 6px; padding: 1em; margin: 0.4em 0; }
    </style>
</head>
<body>
  <div ng-view></div>

  <!-- In production use:
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular.min.js"></script>
  -->
  <script src="lib/angular/angular.js"></script>
  <script src="lib/angular/angular-resource.js"></script>
  <script src="lib/angular/ui-bootstrap-tpls-0.2.0.js"></script>
  <script src="lib/angular/collapse.js"></script>
  <script src="js/app.js"></script>
  <script src="js/services.js"></script>
  <script src="js/controllers.js"></script>
  <script src="js/filters.js"></script>
  <script src="js/directives.js"></script>
  <script src="lib/video.js"></script>
  <script src="lib/Markdown.Converter.js"></script>
  <script src="lib/Markdown.Sanitizer.js"></script>

</body>
</html>
```

Notice the following:

* The application module name is set in `ng-app='appCatalog'`. This will correspond to where we add controllers and
services to modules in the several `.js` files included at the bottom of the shell.
* We include a couple of extra third-party libraries, for video support and Markdown.
* The first and only `<div>` in the code is where `ng-view` is placed, and is where all partial views will be injected.

## Aside: better modularity with AngularJS apps

While the project structure in angular-seed provides a skeleton that is suitable to a front-end as this current
iteration of App Catalog, for a more modular design, I'd recommend you look at these:

* [Code Organizaiton Large AngularJS and JavaScript Applications](http://cliffmeyers.com/blog/2013/4/21/code-organization-angularjs-javascript)
* [Non-trivial AngularJS App](https://github.com/angular-app/angular-app)

What's more interesting about the latter link is what it actually is:

> The idea is to demonstrate how to write a typical, non-trivial CRUD application using AngularJS. To showcase AngularJS in its most advantageous environment we've set out to write a simplified project management tool supporting teams using the SCRUM methodology. The sample application tries to show best practices when it comes to: folders structure, using modules, testing, communicating with a REST back-end, organizing navigation, addressing security concerns (authentication / authorization).

Furthermore, the technical stack is:

* Persistence store: MongoDB hosted on MongoLab
* Backend: Node.js
* Awesome AngularJS on the client
* CSS based on Twitter's bootstrap

We should explore these in more depth when App Catalog grows larger, or for other projects spinning up using
AngularJS.

## Application routes

In `app.js`, we define the routes for the application:

```javascript
'use strict';

// Declare app level module which depends on filters, and services
angular.module('appCatalog', ['appCatalog.filters', 'appCatalog.services', 'appCatalog.directives', 'appCatalog.protodirectives', 'appCatalog.controllers', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});
    $routeProvider.when('/Details/:appId', {templateUrl: 'partials/details.html', controller: 'DetailsCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

```

This is quite simple, just as in the sample tutorial's code we looked at above. Iteration one of App Catalog focuses on
the details route, such that when someone navigates from [http://www.versionone.com/platform](http://www.versionone.com/platform)
to here to `/Details/VersionOne.V1TFS`, Angular will call the `DetailsCtl` controller and inject the `partials/details.html`
partial into the shell's `ng-view` element.

## DetailsCtrl controller

The controller for this is quite simple:

```javascript
'use strict';

angular.module('appCatalog.controllers', []).
  .controller('DetailsCtrl', ['$scope','$routeParams','App',function($scope,$routeParams,App) {
  		App.get( {id:$routeParams.appId}, function(app) {
  			$scope.app = app;
  		});
  }])
  // other controlers ...
```

Here's what's going on:

* Unlike the sample code in the mini tutorial, we use a more isolating way of defining a module: instead of polluting
the global namespace, we call `angular.module(name, dependenciesArray)`, and then use the fluent API to define a
controller named `DetailsCtrl`. This controller itself takes three dependency-injected parameters. The first two are
built into Angular, and the last, `App` is one of our own that we'll see in a second.
* The bizarre looking double listing of parameter names, with the first being strings, is so that if you use a minifier
with full name-minification, then the dependency-injection mechanism can still inject the right named registrations
into your function.
* `App` is much like `Phone` from the mini tutorial. It uses Angular's `$resource` service to access REST resources
painlessly. So, we pass the supplied `appId` from the route parameters collection, then set the result in the completion
callback. As we saw above, we also could have just done `$scope.app = App.get(...)` because of how Angular supports
futures.

## App service for consuming the /entry web service route

Here's the definition for the `App` service we just saw. It is an instance of `$resource`, configured to access
resources at the `/entry` resource relative to the web server's root. This, of course, corresponds to the Node.js
service we spent the first half of this documentation detailing. While not quite the same, this plays a similar
role to what Backbone provides with collections and sync.

```javascript
angular.module('appCatalog.services', ['ngResource']).
	factory('App', function($resource) {
		var App = $resource("/entry");
		return App;
	});
```


## Details partial template

After the `DetailsCtrl` controller has executed, Angular injects the following HTML template into the shell's `ng-view`
element and attached the `$scope` to it:


```html
<div class="container-fluid">
    <div class="row-fluid" id="navigation">
        <div class="span12">
            <a class="return-link btn" href="http://www.versionone.com/platform/"><img src='img/left.png' /><span>Return to Catalog</span></a>
        </div>
    </div>
    <div class="row-fluid" id="content">
    	<div class="span8">
    		<div class="row-fluid">
				<apptitle class="section" src="app.titleSection" />
			</div>
			<div class="row-fluid">
				<description class="section" src="app.descriptionSection" />
			</div>
			<div class="row-fluid" ng-show="app.linksSection">
				<textlinks class="section" src="app.linksSection" />
			</div>
    	</div>
    	<div class="span4">
    		<div class="row-fluid" ng-show="app.mediaSection">
    			<media class="section" src="app.mediaSection" />
    		</div>
    		<div class="row-fluid" ng-show="app.updatesSection">
    			<updates class="section" src="app.updatesSection" />
    		</div>
    	</div>
    </div>
</div>
```

Important observations:

* Since we're using Twitter Bootstrap, we wrap the content with the appropriate `container-fluid`, `row-fluid`, and `span<n>`
styles. There's a great [Pluralsight course on Twitter Bootstrap](http://pluralsight.com/training/Courses/TableOfContents/bootstrap-introduction)
where you can learn all about this.
* Notice that there are various elements that are actually not in the HTML (not even HTML5) spec: `apptitle`,
`description`, `textlinks`, `media`, and `updates`. These are [Angular Directives](http://docs.angularjs.org/guide/directive).
Directives let you create your own components that Angular parses and handles in a custom way. In our case, this allows
us to focus on the frame of the layout, without embedding any of the finer-grain markup and behavior into the layout.

## The updates directive and Markdown support

The updates directive is defined like this:

```javascript
angular.module('appCatalog.directives', []).
	directive('updates', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { src: '=src' },
			templateUrl: 'tpl/updates.html',
			replace: true,
			controller: function($scope,$element) {
				var converter = new Markdown.getSanitizingConverter();
				var collapsedLength = 3;
				var isCollapsed = true;
				var isCollapsible = false;

				$scope.visibleUpdates = collapsedLength;

				$scope.getToggleText = function() {
					if (isCollapsed) {
						return "Show All Updates";
					} else {
						return "Show Fewer Updates";
					}
				}

				$scope.toggleUpdateList = function() {
					if (isCollapsed) {
						$scope.visibleUpdates = $scope.src.updates.length;
					} else {
						$scope.visibleUpdates = collapsedLength;
					}
					isCollapsed = !isCollapsed;
				}

				function convert(txt) {
					if (txt) {
						return converter.makeHtml(txt);
					}
					else
					{
						return '';
					}
				}


				$scope.$watch('src', function(val) {
					if (val && val.updates) {
						for (var i = 0; i< val.updates.length; i++) {
							var entry = val.updates[i];
							entry.cvtDescription = convert(entry.description);
							entry.cvtReleaseNotes = convert(entry.releaseNotes);
						}
						$scope.isCollapsible = (val.updates.length > collapsedLength);
					}
				});
			}
		};

```

Highlights:

* We utilize the `Markdown` third-party library inside the directive's `controller`
* The property `scope: { src: '=src' }` means:
  * Create a brand new, isolated `$scope` for the directive's template to bind to
  * Populate this new scope with a property named `src`, which is bound to member of the parent scope
  * specified bye the value in the `src` attribute of the instance declaration
    in the HTML layout template above: `<updates class="section" src="app.updatesSection" />`
  * Thus, the new scope's `src` property is bound to `app.updatesSection`
* At the end, the `$scope.$watch('src', function(val) ...` call does this:
  * Sets up an [Scope watch](http://docs.angularjs.org/api/ng.$rootScope.Scope) on an expression and executes
    the passed function when the value of that expression changes. In this case, it means whenver the `src`
    property is modified.
  * This function takes the raw `entry.description` and `entry.releaseNotes`, which are Markdown-formatted, and
    converts them to HTML. It then stuffs them into the `cvt`-prefixed properties, which triggers Angular's
    two-way data-binding to update the value in the HTML template shown next

## Updates directive template

As explained above in the last highlight, angular will automatically update the content in the template in response
to changes in the bound `$scope` object's properties. Note below that for rendering HTML as HTML, not as string, we
must do it like this: `ng-bind-html-unsafe='update.cvtDescription'`. If we didn't do that, but instead did
`<p class='markdown'>{{update.cvtDescription}}</p>` inside the `<p>`, then the literal HTML from the Markdown converter
would get converted to escaped HTML. Not what we want. Therefore, we use the unsafe directive instead.

```html
<div>
	<h2>Updates</h2>
	<div class='update transitions' ng-repeat = "update in src.updates | orderBy:'date':true | limitTo:visibleUpdates" >
		<hr/>
        <div class = 'header'>
            <div class = 'left version'>{{update.version}}</div>
			<div class = 'right'>{{update.date | date:'longDate'}}</div>
		</div>
        <v1collapse collapsedheight=75>
            <p class = 'markdown' ng-bind-html-unsafe='update.cvtDescription'></p>
            <p class = 'release-notes markdown' ng-show = 'update.releaseNotes' ng-bind-html-unsafe='update.cvtReleaseNotes'></p>
        </v1collapse>
        <div>
             <div class = 'quality-band' ng-show = 'update.qualityBand'>
            	<span>Quality Band:</span>
            	<a popover="{{src.qualityBands[update.qualityBand].shortDescription}}" popover-title="Quality Band: {{update.qualityBand}}">
                	{{update.qualityBand}}
                </a>
            </div>
            <div class='left' ng-show = 'update.downloadUrl'>
            	<a href='{{update.downloadUrl}}' class='btn download'>
            		<img src="img/download.png" /> <span>Download</span></a>
			</div>
			<div class='right' ng-show = 'update.moreInfoUrl'>
            	<a href='{{update.moreInfoUrl}}' class='btn releasenotes'>
            		<img src="img/documentation.png" /> <span>More Information</span></a>
            </div>
        </div>
	</div>
    <div class = 'collapse-toggle' ng-show='isCollapsible' ng-click='toggleUpdateList()'><span class='toggler'>{{getToggleText()}}</span></div>
</div>
```

The other directives and templates are quite similar to this, but this is the most involved is the media one because
it uses video.js. We will cover that in the next iteration of documentation, however.

## Testing is good Karma

The angular-seed project comes bundled with the Karma test runner, which uses Jasmine.

Here's a screen shot of what the result of running the tests with Firefox, Chrome, and PhantomJS looks like:

![Karma test results](./doc/images/technical/karma.png)

As far as the tests themselves, here's an example of the directives tests:

```coffee
describe "directives", ->
  beforeEach module("appCatalog.directives")
  beforeEach module("tpl/updates.html")
  beforeEach module("tpl/media.html")
  beforeEach module("tpl/mediaContent.html")
  describe "apptitle", ->
    elm = undefined
    scope = undefined
    beforeEach inject(($rootScope, $compile) ->
      scope = $rootScope.$new()
      elm = angular.element("<apptitle src='testapp.titleSection'>")
      $compile(elm) scope
      scope.testapp = sample_data
      scope.$digest()
    )
    it "should bind its content", ->
      titles = elm.find("h1.title")
      summary = elm.find("div.summary")
      expect(titles.eq(0).text()).toBe sample_data.titleSection.name
      expect(summary.eq(0).text()).toBe sample_data.titleSection.shortDescription


  describe "description", ->
    elm = undefined
    scope = undefined
    beforeEach inject(($rootScope, $compile) ->
      scope = $rootScope.$new()
      elm = angular.element("<description src='testapp.descriptionSection'>")
      $compile(elm) scope
      scope.testapp = sample_data
      scope.$digest()
    )
    it "should bind its content", ->
      desc = elm.find(".ng-binding")
      expect(desc.eq(0).text().length).toBeGreaterThan 100

    it "should render Markdown as html", ->
      expect(elm.html()).toContain "<strong>"

    it "should exclude forbidden tags from its content", ->
      expect(elm.html()).not.toContain "<script>"


  describe "textlinks", ->
    elm = undefined
    scope = undefined
    beforeEach inject(($rootScope, $compile) ->
      scope = $rootScope.$new()
      elm = angular.element("<textlinks src='testapp.linksSection'>")
      $compile(elm) scope
      scope.testapp = sample_data
      scope.$digest()
    )
    it "should have the right number of entries", ->
      items = elm.find("li")
      expect(items.length).toBe sample_data.linksSection.length

    it "should allow multiple entries of the same type", ->
      images = elm.find("img")
      expect(images.eq(0).attr("ng-src")).toBe images.eq(1).attr("ng-src")

    it "should use the default icon for unknown types", ->
      images = elm.find("img")
      expect(images.eq(5).attr("ng-src")).toBe "img/hypelink.png"
```

## Debunking AngularJS vs. Backbone myths

Having uses Backbone for the VersionOne Requestor, and a number of blog post samples, I was really enjoying it.
Backbone Forms (a free script on GitHub) really makes it easy to create quick entry forms, even with nested objects.
Yet, the drumbeat of AngularJS and its growing popularity was in the back of my mind, so when it came time to build
App Catalog, we looked into it and found it to be a comprehensive choice. This post really made it clear for me and
dispelled any lingering doubts as to whether we should try it:

[Backbonejs vs Angularjs : Demystifying the myths](http://www.nebithi.com/2012/12/27/backbone-and-angular-demystifying-the-myths/)

This is also a good post: [Lessons Learned: A Year with a Large AngularJS Project](http://joelhooks.com/blog/2013/05/22/lessons-learned-kicking-off-an-angularjs-project/)

You can find all kinds of resources for AngularJS now, including books, courses, meetups, etc. There is a recent
course on Pluralsight that looks good, but I have not tried it yet.

# Jenkins job with JavaScript code coverage

The code deployment flow for App Catalog looks like this:

![App Catalog Code Deployment Pipeline](http://www.websequencediagrams.com/cgi-bin/cdraw?lz=CnRpdGxlIEFwcCBDYXRhbG9nIENvZGUgRGVwbG95bWVudCBQaXBlbGluZQoKRGV2ZWxvcGVyLT4ABAdpbmcgQnJhbmNoOiBQdXNoADgFACAIABMKLT4rSmVua2luczogQnVpbGQKAAgHLT4tABAJVGVzdABEIE1lcmdlIHRvIFN0YWdpbmcAVxQAFAcAJg4KAAgOLT5BenVyZQA_CDoAgWkHAIFWDQAzFSB0byBQcm9kdWN0aW9uAEURTWFzdGVyAGwPAAgNAHIIADsKAHMKCQkJ&s=qsd)

This is not as automated as we would like, ultimately, but it gets us where we need to be for now. And, all of this
is greatly simplified by Azure's GitHub integration. First, let's look at the build and test step in Jenkins.

```bash
echo $WORKSPACE
cd $WORKSPACE
cd src/server
pwd
export server_auth_user=catUser
export server_auth_password=CatsAreUs
export mongoDb_uri=mongodb://appcatalog:passwordGoesHere#@ds055997.mongolab.com:31477/appcatalog
npm install
./build.sh
./test.sh
./testCoverage2.sh
./testCoverage.sh

```

There are some non-ideal things here, like running the tests three times. But, I have not found a way to get the three
reports from one test run using mocha.

## Test Anything Protocol report

The first test run uses the Test Anything Protocol plugin for mocha, and produces this result, which we archive in
Jenkins:

```text
1..41
ok 1 AppCatalogEntry: overall fails for an empty entry
ok 2 AppCatalogEntry: overall fails when id exceeds maxLength
ok 3 AppCatalogEntry: titleSection fails on titleSection empty
ok 4 AppCatalogEntry: titleSection succeeds on valid titleSection
ok 5 AppCatalogEntry: titleSection fails on invalid types for titleSection
ok 6 AppCatalogEntry: titleSection fails when a titleSection properties exceed maxLength
ok 7 AppCatalogEntry: titleSection fails on invalid types for titleSection/support
ok 8 AppCatalogEntry: titleSection fails on invalid URI in titleSection/support/href
ok 9 AppCatalogEntry: descriptionSection fails when descriptionSection missing
ok 10 AppCatalogEntry: descriptionSection fails on empty descriptionSection
ok 11 AppCatalogEntry: descriptionSection fails on invalid types for descriptionSection
ok 12 AppCatalogEntry: descriptionSection fails when description exceeds maxLength
ok 13 AppCatalogEntry: linksSection fails when linksSection missing
ok 14 AppCatalogEntry: linksSection fails when linkSection link missing required properties
ok 15 AppCatalogEntry: linksSection fails on invalid types for linksSection
ok 16 AppCatalogEntry: linksSection fails on invalid href in linksSection
ok 17 AppCatalogEntry: linksSection fails when linksSection properties exceed maxLength
ok 18 AppCatalogEntry: updatesSection/updates fails when updatesSection missing
ok 19 AppCatalogEntry: updatesSection/updates fails when updatesSection empty
ok 20 AppCatalogEntry: updatesSection/updates fails when updatesSection/updates properties exceed maxLength
ok 21 AppCatalogEntry: updatesSection/updates fails on invalid types for updatesSection/updates
ok 22 AppCatalogEntry: updatesSection/updates fails when updatesSection/updates is missing required properties
ok 23 AppCatalogEntry: updatesSection/updates fails on invalid moreInfoUrl in updatesSection/updates
ok 24 AppCatalogEntry: updatesSection/updates fails on invalid downloadUrl in updatesSection/updates
ok 25 AppCatalogEntry: updatesSection/qualityBands fails when qualityBands has fewer than 1 property
ok 26 AppCatalogEntry: updatesSection/qualityBands fails when a qualityBand is missing required properties
ok 27 AppCatalogEntry: updatesSection/qualityBands fails when a qualityBand has invalid types
ok 28 AppCatalogEntry: updatesSection/qualityBands fails when a qualityBand properties exceed maxLength
ok 29 AppCatalogEntry: updatesSection/qualityBands fails on invalid href in a qualityBand
ok 30 AppCatalogEntry: updatesSection/qualityBands fails when an update refers to a non-existent qualityBand
ok 31 AppCatalogEntry: mediaSection fails when a mediaSection item is missing required properties
ok 32 AppCatalogEntry: mediaSection fails on invalid types for mediaSection
ok 33 AppCatalogEntry: mediaSection fails on invalid href or thumbhref in mediaSection
ok 34 AppCatalogEntry: mediaSection fails when mediaSection properties exceed maxLength
ok 35 PUT /entry fails without basic authentication responds with JSON failure message
ok 36 PUT /entry for Happy Path With Required Data responds with JSON success message
ok 37 PUT /entry for each examples succeeds responds with JSON success message
ok 38 PUT /entry for Failure Path With Invalid JSON responds with JSON failure message
ok 39 service findAll call find
ok 40 service findById call findOne
ok 41 service put call validate and update
# tests 41
# pass 41
# fail 0
```

## JSCoverage for line-by-line coverage

The `testCoverage.sh` script:

```
#!/usr/bin/sh
rm -rf ../app_cov
export app_cov=1
../../lib/jscoverage --no-highlight ../app ../app_cov
mkdir testResults
mocha -R html-cov *.tests*js >testResults/coverage.html
```

This uses the binary `jscoverage` to first produce a covered version of all the files in `../app` and store
them in `../app_cov`. THen, it uses mocha to run the tests and produce the report.

This should now explain how the `requireCover` module from way back in the beginning helps us make testing easier.
Recall:

```coffee
module.exports = (appName, envVarCoverageToggleName='', pathToRawFiles='', pathToCoveredFiles='') ->
    return (moduleName) ->
      envVarCoverageToggleName = "#{appName}_cov" if envVarCoverageToggleName is ''
      pathToRawFiles = "../#{appName}" if pathToRawFiles is ''
      pathToCoveredFiles = "../#{appName}_cov" if pathToCoveredFiles is ''
      modulesPath = if process.env[envVarCoverageToggleName]? then pathToCoveredFiles else pathToRawFiles
      modulePath = "#{modulesPath}/#{moduleName}"
      return require(modulePath)
```

Because we do `export app_cov=1` in the shell script, requireCover will load the
JSCoverage-produced files from `app_cov` instead of `app`.

### Covered code example

Speaking of JSCoverage-produced files, here's what `app_cov/service.js` looks like after JSCoverage does its deed:

```javascript
if (typeof _$jscoverage !== 'object') {
  _$jscoverage = {};
}
if (! _$jscoverage['service.js']) {
  _$jscoverage['service.js'] = [];
  _$jscoverage['service.js'][2] = 0;
  _$jscoverage['service.js'][3] = 0;
  _$jscoverage['service.js'][5] = 0;
  _$jscoverage['service.js'][7] = 0;
  _$jscoverage['service.js'][8] = 0;
  _$jscoverage['service.js'][9] = 0;
  _$jscoverage['service.js'][10] = 0;
  _$jscoverage['service.js'][11] = 0;
  _$jscoverage['service.js'][15] = 0;
  _$jscoverage['service.js'][16] = 0;
  _$jscoverage['service.js'][17] = 0;
  _$jscoverage['service.js'][21] = 0;
  _$jscoverage['service.js'][22] = 0;
  _$jscoverage['service.js'][27] = 0;
  _$jscoverage['service.js'][28] = 0;
  _$jscoverage['service.js'][31] = 0;
  _$jscoverage['service.js'][32] = 0;
  _$jscoverage['service.js'][33] = 0;
  _$jscoverage['service.js'][35] = 0;
  _$jscoverage['service.js'][36] = 0;
  _$jscoverage['service.js'][38] = 0;
  _$jscoverage['service.js'][39] = 0;
  _$jscoverage['service.js'][49] = 0;
  _$jscoverage['service.js'][54] = 0;
  _$jscoverage['service.js'][55] = 0;
  _$jscoverage['service.js'][59] = 0;
  _$jscoverage['service.js'][63] = 0;
}
_$jscoverage['service.js'].source = ["// Generated by CoffeeScript 1.6.2","(function() {","  var AppCatalogEntry, AppCatalogService;","","  AppCatalogEntry = require('./appCatalogEntry');","","  AppCatalogService = (function() {","    function AppCatalogService(appCatalogEntry) {","      this.appCatalogEntry = appCatalogEntry != null ? appCatalogEntry : null;","      if (this.appCatalogEntry == null) {","        this.appCatalogEntry = AppCatalogEntry;","      }","    }","","    AppCatalogService.prototype.findAll = function(callback) {","      return this.appCatalogEntry.find({}, '', function(err, result) {","        return callback(err, result);","      });","    };","","    AppCatalogService.prototype.findById = function(id, callback) {","      return this.appCatalogEntry.findOne({","        'id': id","      }, '', callback);","    };","","    AppCatalogService.prototype.put = function(body, callback) {","      var ex,","        _this = this;","","      try {","        return this.appCatalogEntry.validate(body, function(errs) {","          var entry;","","          if (errs != null) {","            return callback(errs);","          } else {","            entry = new _this.appCatalogEntry(body);","            return _this.appCatalogEntry.update({","              'id': body.id","            }, {","              $set: body,","              $inc: {","                docVersion: 1","              }","            }, {","              upsert: true","            }, function(err, data) {","              return callback(err);","            });","          }","        });","      } catch (_error) {","        ex = _error;","        return callback(ex);","      }","    };","","    return AppCatalogService;","","  })();","","  module.exports = AppCatalogService;","","}).call(this);"];
_$jscoverage['service.js'][2]++;
(function () {
  _$jscoverage['service.js'][3]++;
  var AppCatalogEntry, AppCatalogService;
  _$jscoverage['service.js'][5]++;
  AppCatalogEntry = require("./appCatalogEntry");
  _$jscoverage['service.js'][7]++;
  AppCatalogService = (function () {
  _$jscoverage['service.js'][8]++;
  function AppCatalogService(appCatalogEntry) {
    _$jscoverage['service.js'][9]++;
    this.appCatalogEntry = ((appCatalogEntry != null)? appCatalogEntry: null);
    _$jscoverage['service.js'][10]++;
    if ((this.appCatalogEntry == null)) {
      _$jscoverage['service.js'][11]++;
      this.appCatalogEntry = AppCatalogEntry;
    }
}
  _$jscoverage['service.js'][15]++;
  AppCatalogService.prototype.findAll = (function (callback) {
  _$jscoverage['service.js'][16]++;
  return this.appCatalogEntry.find({}, "", (function (err, result) {
  _$jscoverage['service.js'][17]++;
  return callback(err, result);
}));
});
```

### Coverage report

So, JSCoverage basically counts how many times each line of code gets called. And, then it produces a report like
this:

![JSCoverage report](./doc/images/technical/jscoverage.png)


## Cobertura plugin for code coverage summary

The other coverage run produces a smaller, summarized report used by the Cobertura plugin in Jenkins to
provide a dashboard view of the coverage status for recent builds:

![Cobertura code coverage summary](./doc/images/technical/cobertura.png)
