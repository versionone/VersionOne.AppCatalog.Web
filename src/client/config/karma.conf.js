// Karma configuration
// Generated on Tue May 21 2013 12:49:28 GMT-0400 (Eastern Daylight Time)


// base path, that will be used to resolve files and exclude
basePath = '../app';


// frameworks to use
frameworks = ['jasmine'];


// list of files / patterns to load in the browser
files = [
  '../test/lib/jquery-1.8.1.min.js',
  'lib/angular/angular.js',
  'lib/angular/angular-resource.js',
  'lib/*.js',
  '../test/lib/angular/angular-mocks.js',
  'js/**/*.js',
  '../test/unit/*.js',
  'tpl/*.html'
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
reporters = ['progress','coverage', 'junit'];

preprocessors = {
  'tpl/*html': 'html2js',
  'js/**/*.js': 'coverage'
};

coverageReporter = {
  type: 'cobertura',
  dir: '../test/coverage'
}

junitReporter = {
  outputFile: 'client-test-results.xml'
}


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome','Firefox','PhantomJS'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;


// plugins to load
plugins = [
  'karma-jasmine',
  'karma-chrome-launcher',
  'karma-firefox-launcher',
  'karma-phantomJS-launcher',
  'karma-ng-html2js-preprocessor',
  'karma-coverage',
  'karma-junit-reporter'
];
