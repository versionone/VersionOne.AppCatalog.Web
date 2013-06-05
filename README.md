# VersionOne Application Catalog

The VersionOne Application Catalog makes it easy for developers to publish information about their product in a way that reaches VersionOne customers with attractive presentation.

## VersionOne.AppCatalog.Web

Node.js and MongoDB based web service for App Catalog with AngularJS based front end.

## Server side code: /src/server

This contains the full code for the Node-based server side code and all its build, test, and coverage support.

### Configuration and deployment

Because the app runs in Azure when deployed, we utilize the `nconf` package to provide hybrid config file / environment 
variable configuration.

The file `src/server/config.coffee` abstracts this detail as follows:

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

This does the following:

* It defaults to looking for `config.jon` in the current directory, unless an environment variable specifies otherwise.
* The lines `nconf.file(configFile).env()` makes nconf read variables first from the config file, and then from the 
environment variables. **Environment variables** override config file variables. This is important for Azure 
-- explained below.
* After that, it reads various parameters or default values.

### Configuration options

#### mongoDb_uri

Contains the uri (with credentials) for the MongoDB instance to use. 

#### user and password

Specifies the user name and password that HTTP PUT requests most specify in order to authenticate when modifying 
a catalog entry.

### Azure configuration

Because the code in this repository is open source, we cannot simply check config files into the repository with the 
credentials and passwords, can we? Of course, we do check in a `config.json` and `config.example.json`, but these are 
for the stagig and/or testing environments, not the production environment!

In Azure, sepcify the three parameteters in the **App Settings** section of the **CONFIGURE** tab. The App Settings 
parameters get copied to environment variables when running a Node web site. This keeps the secret values secret and 
out of the repository.


### build.sh

Compiles the CoffeeScript to JavaScript in both the `app` and `test` folders.

### test.sh

Runs the tests, outputing a TAP report (Test Anything Protocol) to `test/testResults/testResults.tap` file, 
and also displaying the results on the console. Jenkins uses this to produce a nice chart on the dashboard to track the 
test result pass/fail history.


### testCoverage.sh

Runs testCoverage with Mocha's HTML converter, which shows line-by-line which lines were covered under execution, and 
outputs to `test/testResults/coverage.html`.

### testCoverage2.sh

Probably should name this better. Runs the tests and outputs Cobertura style output, for which Jenkins has a great plugin 
and reporter that shows up right on the project's dashboard.

### app/ folder

Contains all the source code for the AppCatalogService and its related parts. This code is fairly well segmented in terms 
of separation of concerns and maintainability. Perhaps some metrics guru tools can further assess that.

Some files could probably use some better names, like `server` and `serverClass`. Actually, I think `serverClass` can now
become `server` or `webServer` because of how we use `nconf` now to specify configuration.

### test/ folder

Contains all the test classes that test the various parts of the implementation. It also contains the `examples` folder that
houses the catalog entries Ian Buchanan has been creating.

#### appCatalogEntry.test.base.coffee

Contains some functional, reusable functions to make the validation tests simpler to read and maintain.

### appCatalogEntry.tests.validation.coffee

Contains all the unit tests related to the various sections of an entry. 

#### service.tests.coffee

Contains integration tests that verify the service itself consumes the underlying Mongoose API as expected, 
using SinonJS to mock the dependency.

#### server.tests.coffee

Contains end-to-end tests with real example data that get PUT to a running instance of the `server` itself. As such, it
depends on MongoDB being installed locally, or on a properly configured remote MongoDB instance.


#### requireCover.coffee

Provides wrapper on top of `require()` that takes into account whether running with code coverage or not.

## Jenkins

As mentioned above, Jenkins will run the tests and collect the coverage reports and publish them to the dashboard for 
the project. It does this in a post-build step with a couple of reporting plugins.
