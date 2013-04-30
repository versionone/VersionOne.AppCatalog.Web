'use strict';

/* Controllers */

angular.module('appCatalog.controllers', []).
  controller('ListCtrl', ['$scope', 'App', function($scope,App) {
  		App.query(function(apps) {
  			$scope.apps = apps
  		});
  }])
  .controller('DetailsCtrl', ['$scope','$routeParams','App',function($scope,$routeParams,App) {
  		App.get( {id:$routeParams.appId}, function(app) {
  			$scope.app = app;
  		});
  }])
  .controller('ProtoCtrl', ['$scope','App',function($scope,App) {
      App.get( {id:'v1ClarityPPM.old'}, function(app) {
        $scope.app = app;
      });
  }])
    .controller('TestCtrl', ['$scope',function($scope) {
      $scope.app = {
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
    ],
 "updatesSection": {
        "updates": [
            {
                "date": {
                    "$date": "2013-02-13T17:45:00.000Z"
                },
                "description": "stabilizing timesheet workflow",
                "version": "0.3.2.13",
                "releaseNotes": "http://example.com",
                "qualityBand": "mature",
                "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.3.2.13.zip",
                "_id": {
                    "$oid": "516d9a4824a05b205800009a"
                }
            },
            {
                "date": {
                    "$date": "2013-01-13T17:45:00.000Z"
                },
                "description": "better timesheet support",
                "version": "0.3.3.5",
                "releaseNotes": "http://example.com",
                "qualityBand": "sapling",
                "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.2.1.10.zip",
                "_id": {
                    "$oid": "516d9a4824a05b2058000099"
                }
            },
            {
                "date": {
                    "$date": "2013-01-13T17:45:00.000Z"
                },
                "description": "better timesheet support",
                "version": "0.2.1.10",
                "releaseNotes": "http://example.com",
                "qualityBand": "sapling",
                "downloadUrl": "http://platform.versionone.com.s3.amazonaws.com/downloads/v1clarityppm_0.2.1.10.zip",
                "_id": {
                    "$oid": "516d9a4824a05b2058000099"
                }
            }
        ],
          "qualityBands": {
            "seed": {
                "name": "seed",
                "shortDesc": "The initial idea of a product. No working code.",
                "href": "https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#seed",
                "_id": {
                    "$oid": "516d9a4824a05b205800009d"
                }
            },
            "sapling": {
                "name": "sapling",
                "shortDesc": "The product is undergoing rapid growth. The code works but expect major changes.",
                "href": "https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#sapling",
                "_id": {
                    "$oid": "516d9a4824a05b205800009c"
                }
            },
            "mature": {
                "name": "mature",
                "shortDesc": "The product is stable. The code will continue to evolve with minimum breaking changes.",
                "href": "https://github.com/versionone/V1ClarityPPM/blob/master/CONTRIBUTING.md#mature",
                "_id": {
                    "$oid": "516d9a4824a05b205800009b"
                }
            }
        }
    },
    "mediaSection": [
        {
            "title": "Home",
            "caption": "The home image",
            "type": "image/png",
            "href": "content/gallery/Projekt_es_Projekt_portfolio_menedzsment_ca_clarity_ppm_masolata.jpg",
            "thumbhref": "content/gallery/Projekt_es_Projekt_portfolio_menedzsment_ca_clarity_ppm_masolata.jpg"
        },
        {
            "type": "image/png",
            "href": "content/gallery/ppm-roadmap-large.jpg",
            "thumbhref": "content/gallery/ppm-roadmap-large.jpg"
        },
        {
            "type": "video/flv",
            "href": "http://www.versionone.tv.s3.amazonaws.com/Clarity/Clarity.flv",
            "thumbhref": "content/gallery/ClaritySplash.png"
        },
        {
            "title": "Junk",
            "caption": "You shouldn't see this!",
            "type": "foo/bar",
            "href": "http://www.versionone.tv.s3.amazonaws.com/Clarity/Clarity.flv",
            "thumbhref": "content/gallery/ClaritySplash.png"
        }

    ]
};
  }]);