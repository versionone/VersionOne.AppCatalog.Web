'use strict';

/* jasmine specs for directives go here */
var sample_app = {"_id":"516d9a4824a05b2058000098",
  "id":"testId",
  "name":"Test",
  "summary":"Test summary",
  "description":"Test description",
  "cost":"Free",
  "support":{"href":"http://support.versionone.com/home","title":"Supported by VersionOne"},"updates":[{"_id":"516d9a4824a05b205800009a","downloadUrl":"http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip","qualityBand":"mature","version":"0.3.2.13","description":"stabilizing timesheet workflow","date":"2013-02-13T17:45:00.000Z"},{"_id":"516d9a4824a05b2058000099","downloadUrl":"http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.2.1.10.zip","qualityBand":"sapling","version":"0.2.1.10","description":"better timesheet support","date":"2013-01-13T17:45:00.000Z"}],"qualityBands":[{"_id":"516d9a4824a05b205800009d","href":"https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#seed","shortDescription":"The initial idea of a product. No working code.","name":"seed"},{"_id":"516d9a4824a05b205800009c","href":"https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#sapling","shortDescription":"The product is undergoing rapid growth. The code works but expect major changes.","name":"sapling"},{"_id":"516d9a4824a05b205800009b","href":"https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#mature","shortDescription":"The product is stable. The code will continue to evolve with minimum breaking changes.","name":"mature"}],"visualLinks":[{"isCustom":true,"_id":"516d9a4824a05b20580000a3","content":"<video id='video1' class='video-js vjs-default-skin' controls preload='none' poster='content/gallery/ClaritySplash.png' data-setup='{}'><source src='http://www.versionone.tv.s3.amazonaws.com/Clarity/Clarity.flv' type='video/flv'></video>","title":"Video"},{"isCustom":true,"_id":"516d9a4824a05b20580000a2","content":"<video id='video2' class='video-js vjs-default-skin' controls preload='none' poster='content/gallery/TeamRoomSplash.png' data-setup='{}'><source src='http://www.versionone.tv.s3.amazonaws.com/TeamRoom/TeamRoom.flv' type='video/flv'></video>","title":"Video"},{"isCustom":false,"_id":"516d9a4824a05b20580000a1","thumb-href":"content/gallery/Projekt_es_Projekt_portfolio_menedzsment_ca_clarity_ppm_masolata.jpg","href":"content/gallery/Projekt_es_Projekt_portfolio_menedzsment_ca_clarity_ppm_masolata.jpg","title":"Home"},{"isCustom":false,"_id":"516d9a4824a05b20580000a0","thumb-href":"content/gallery/ppm-roadmap-large.jpg","href":"content/gallery/ppm-roadmap-large.jpg","title":"Chart"},{"isCustom":false,"_id":"516d9a4824a05b205800009f","thumb-href":"content/gallery/7f7c7269-69b3-49d3-959e-5575acbbe6db.JPG","href":"content/gallery/7f7c7269-69b3-49d3-959e-5575acbbe6db.JPG","title":"Graph"},{"isCustom":false,"_id":"516d9a4824a05b205800009e","thumb-href":"content/gallery/a64a08b6-b31c-4bd4-b51c-4cf50a9faa76.JPG","href":"content/gallery/a64a08b6-b31c-4bd4-b51c-4cf50a9faa76.JPG","title":"More graphs"}],"textLinks":[{"_id":"516d9a4824a05b20580000a7","type":"download","href":"http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip","title":"Download Latest Preview"},{"_id":"516d9a4824a05b20580000a6","type":"code","href":"https://github.com/versionone/V1ClarityPPM","title":"Source Code"},{"_id":"516d9a4824a05b20580000a5","type":"documentation","href":"https://github.com/versionone/V1ClarityPPM/blob/master/README.md","title":"Documentation"},{"_id":"516d9a4824a05b20580000a4","type":"license","href":"https://github.com/versionone/V1ClarityPPM/blob/master/LICENSE.md","title":"Modified BSD (3-clause) License"}],"__v":0,"docVersion":1};

describe('protodirectives', function() {

  beforeEach(module('appCatalog.protodirectives'));

  describe('apptitle', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elm = angular.element("<apptitlep appl='testapp'>");
      $compile(elm)(scope);
      scope.$digest();
    }));

    it('should bind the content', function() {
      var titles = elm.find('h1.title');
      var summary = elm.find('div.summary');

      expect(titles.length).toBe(1);
      expect(titles.eq(0).text()).toBe('');

      expect(summary.length).toBe(1);
      expect(summary.eq(0).text()).toBe('');

      scope.$apply(function() {
        scope.testapp = sample_app;
      });

      expect(titles.eq(0).text()).toBe('Test');
      expect(summary.eq(0).text()).toBe('Test summary');
    });
  });

  describe('qualifiers', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elm = angular.element("<qualifiersp appl='testapp'>");
      $compile(elm)(scope);
      scope.$digest();
    }));

    it('should bind the content', function() {
      var cost = elm.html();

      expect(cost).toBe('<b class="costLabel">Cost:</b> ');

      scope.$apply(function() {
        scope.testapp = sample_app;
      });
      cost = elm.html();
      expect(cost).toBe('<b class="costLabel">Cost:</b> Free');;
    });
  });

  describe('description', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elm = angular.element("<descriptionp appl='testapp'>");
      $compile(elm)(scope);
      scope.$digest();
    }));

    it('should be populated after data load', function() {
      var items = elm.find('p');

      expect(items.length).toBe(2);
      expect(items.eq(1).text()).toBe('');

      scope.$apply(function() {
        scope.testapp = sample_app;
      });

      expect(items.eq(1).text()).toBe('Test description');
    });
  });

  describe('textlinks', function() {
    var elm, scope;

    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      elm = angular.element("<textlinksp appl='testapp'>");
      $compile(elm)(scope);
      scope.$digest();
    }));

    it('should exist after data load', function() {

      scope.$apply(function() {
        scope.testapp = sample_app;
      });

      var images = elm.find('img');
      var links = elm.find('a');

      expect(images.eq(0).attr('ng-src')).toBe('img/'+sample_app.textLinks[0].type+'.png');
      expect(links.eq(0).attr('href')).toBe(sample_app.textLinks[0].href);
    });
  });

});
