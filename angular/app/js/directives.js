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
				$scope.getType = function(item) {
					return 'image';
				};
				$scope.isImage = function(item) {
					return $scope.getType(item) == 'image';
				};
				$scope.isVideo = function(item) {
					return $scope.getType(item) == 'video';
				};
			}
		};
	}).
	directive('v1slide', ['$compile', function(compile) {
		return {
			restrict: 'E',
			scope: {slide: '=item'},
			link: function(scope, element, attrs) {
				var strTemplate = '<div>';
				var item = scope.slide;
				switch(item.type) {
				case 'image/png':
					strTemplate += "<img ng-src='{{slide.href}}'/>" 
					break;
				case 'video/flv':
					strTemplate += "<video id='video2' class='video-js vjs-default-skin' " +
						"controls preload='none' poster='{{slide.thumbhref}}' " +
						"data-setup='{}'> <source src='{{slide.href}}'" +
						" type='video/flv'></video>";
					break;
				default:
				}
				strTemplate += 	
					"	<div class='label'>" +
		    		"		<h4 class='title'>{{slide.title}}</h4>" +
		    		"		<p class='caption'>{{slide.caption}}</p>" +
		    		"	</div>" +
		    		"</div>"
		    	var e = angular.element(strTemplate);
            	compile(e.contents())(scope);

            	element.replaceWith(e);
			}
		}
	}]).
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