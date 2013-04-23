'use strict';

/* jasmine specs for directives go here */

var sample_title = {"_id":"51704a732e7b36a8e55400a5",
"id":"HappyPathWithRequiredData",
"titleSection":{
  "support":{
    "href":"http://support.versionone.com/home",
    "text":"VersionOne Support"},
  "pricing":"Free",
  "shortDescription":"a quick summary",
  "name":"Happy Path With Required Data"},
"docVersion":1}

describe('directives', function() {

  beforeEach(module('appCatalog.directives'));

  describe('apptitle', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elm = angular.element("<apptitle appl='testapp.titleSection'>");
      $compile(elm)(scope);
      scope.$digest();
    }));

    it('should bind its content', function() {
      var titles = elm.find('h1.title');
      var summary = elm.find('div.summary');


      expect(titles.length).toBe(1);
      expect(titles.eq(0).text()).toBe('');

      expect(summary.length).toBe(1);
      expect(summary.eq(0).text()).toBe('');

      scope.$apply(function() {
        scope.testapp = sample_title;
      });
;
      expect(titles.eq(0).text()).toBe('Happy Path With Required Data');
      expect(summary.eq(0).text()).toBe('a quick summary');
    });
  });
});
