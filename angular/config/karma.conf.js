basePath = '../app';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  '../test/lib/jquery-1.8.1.min.js',
  'lib/angular/angular.js',
  'lib/*.js',
  '../test/lib/angular/angular-mocks.js',
  'js/**/*.js',
  '../test/unit/*.js',
  'tpl/*.html'
];

preprocessors = {
	'tpl/*.html': 'html2js'
};

autoWatch = true;

// Full path to executables may be required in matching
// environment variables: CHROME_BIN, FIREFOX_BIN, etc.
browsers = ['Chrome','Firefox','PhantomJS','IE']
