# Relocate branch details

This branch contains a lot of clean up and has code coverage and full test automation for the build under Jenkins.
I'm sure some Jenkins gurus and buildmasters can improve the way I did it, so here's the gist:

## Server side code: /src/server

This contains the full code for the Node-based server side code and all its build, test, and coverage support.

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

