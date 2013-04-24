'use strict';

/* jasmine specs for directives go here */

var sample_data = {
    "_id": {
        "$oid": "51704a732e7b36a8e55400a5"
    },
    "docVersion": 1,
    "id": "ProgressiveTest",
    "titleSection": {
        "name": "Progessive Test Data",
        "shortDescription": "This is a test entry for use during development.",
        "pricing": "Free",
        "support": {
            "text": "VersionOne Support",
            "href": "http://support.versionone.com/home"
        }
    },
    "descriptionSection": {
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volu."
    },
    "linksSection": [
        {
            "_id": "516d9a4824a05b20580000a7",
            "type": "download",
            "href": "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip",
            "title": "Download Latest Stable Release"
        },
        {
            "_id": "516d9a4824a05b20580000a7",
            "type": "download",
            "href": "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip",
            "title": "Download Latest Nightly Build"
        },
        {
            "_id": "516d9a4824a05b20580000a6",
            "type": "code",
            "href": "https://github.com/versionone/V1ClarityPPM",
            "title": "Source Code"
        },
        {
            "_id": "516d9a4824a05b20580000a5",
            "type": "documentation",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/master/README.md",
            "title": "Documentation"
        },
        {
            "_id": "516d9a4824a05b20580000a4",
            "type": "license",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/master/LICENSE.md",
            "title": "Modified BSD (3-clause) License"
        },
        {
            "_id": "516d9a4824a05b20580000a3",
            "type": "foo",
            "href": "https://github.com/versionone/V1ClarityPPM/blob/master",
            "title": "Sample configuration"
        }
    ]
}

describe('directives', function() {

  beforeEach(module('appCatalog.directives'));

  describe('apptitle', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elm = angular.element("<apptitle appl='testapp.titleSection'>");
      $compile(elm)(scope);
      scope.testapp = sample_data;
      scope.$digest();
    }));

    it('should bind its content', function() {
      var titles = elm.find('h1.title');
      var summary = elm.find('div.summary');

      expect(titles.eq(0).text()).toBe(sample_data.titleSection.name);
      expect(summary.eq(0).text()).toBe(sample_data.titleSection.shortDescription);
    });
  });

  describe('description', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elm = angular.element("<description appl='testapp.descriptionSection'>");
      $compile(elm)(scope);
      scope.testapp = sample_data;
      scope.$digest();
    }));

    it('should bind its content', function() {
      var desc = elm.find('p');
      expect(desc.eq(0).text()).toBe(sample_data.descriptionSection.description);
    });
  });

  describe('textlinks', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elm = angular.element("<textlinks appl='testapp.linksSection'>");
      $compile(elm)(scope);
      scope.testapp = sample_data;
      scope.$digest();
    }));

    it('should have the right number of entries', function() {
      var items = elm.find('li');
      expect(items.length).toBe(sample_data.linksSection.length);
     });

    it('should allow multiple entries of the same type', function() {
      var images = elm.find('img');
      expect(images.eq(0).attr('ng-src')).toBe(images.eq(1).attr('ng-src'));
    });

    it('should use the default icon for unknown types', function() {
      var images = elm.find('img');
      expect(images.eq(5).attr('ng-src')).toBe('img/genericlink.png');
    });
  });
});
