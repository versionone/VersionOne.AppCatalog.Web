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

