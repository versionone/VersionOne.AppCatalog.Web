'use strict';

/* Directives */


angular.module('appCatalog.directives', []).
	directive('apptitle', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { src: '=src' },
			replace: true,
			template: "<div class='titleView'>" +
				    "<h1 class='title'>{{src.name}}</h1>" +
				    "<div class='summary'>{{src.shortDescription}}</div>" +
				    "<div class='cost'>Cost: {{src.pricing}}</div>" +
				    "<div class='support'>Supported by <a href='{{src.support.href}}' target='_blank'>{{src.support.text}}</a></div>" +
				    "</div>"
		};
	}).
	directive('description', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { src: '=src' },
			replace: true,
			template: "<div class='description'>" +
					"<h2>Details</h2>" +
					"<p>{{src.description}}</p>" +
				"</div>"
		};
	}).
	directive('media', function() {
		return {
			restrict: 'E',
			scope: { src: '=src' },
			templateUrl: 'tpl/media.html',
			replace: true,
			controller: function($scope) {
				$scope.isValid = function(item) {
					switch (item.type.split('/')[0]) {
						case 'image':
							return true;
						case 'video':
							return true;
						default:
							return false;
					}
				}
			}
		};
	}).
	directive('mediacontent', function() {
		return {
			restrict: 'E',
			require: '^media',
			scope: { src: '=src' },
			templateUrl: 'tpl/mediaContent.html',
			replace: true,
			controller: function($scope) {
				$scope.getType = function(item) {
					return item.type.split('/')[0];
				};
			}
		};
	}).
	directive('updates', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { src: '=src' },
			templateUrl: 'tpl/updates.html',
			replace: true
		};
	}).
	directive('textlinks', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { src: '=src'},
			replace: true,
			template: "<ul class='textLinks nav nav-tabs nav-stacked'>" +
				    "    <li ng-repeat = 'link in src'>" +
				    "        <a href='{{link.href}}'>" +
				    "            <img ng-src='{{getLinkIcon(link.type)}}'>" +
				    "            {{link.title}}" +
				    "        </a>" +
				    "    </li>" +
					"</ul>",
			controller: function($scope) {
				$scope.getLinkIcon = function(linktype) {
				    switch(linktype) {
			          case "download":
			            return "img/download.png";
			          case "code":
			            return "img/code.png";
			          case "documentation":
			            return "img/documentation.png";
			          case "license":
			            return "img/license.png";
			          default:
			            return "img/hypelink.png";
			        }
        		}
			}
		};
	});