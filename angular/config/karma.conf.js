basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'test/lib/jquery-1.8.1.min.js',
  'app/lib/angular/angular.js',
  'test/lib/angular/angular-mocks.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['C:/Program Files (x86)/Google/Chrome/Application/chrome.exe']

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
