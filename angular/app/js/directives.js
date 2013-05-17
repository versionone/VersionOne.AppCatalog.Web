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
				    "<div class='support'>Supported by <a href='{{src.support.href}}' target='_blank'>{{src.support.text}}</a></div>" +
				    "<div class='summary'>{{src.shortDescription}}</div>" +
				    "<div class='cost'><span>Cost:</span> {{src.pricing}}</div>" +
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
					"<v1collapse collapsedheight=150><div class='markdown' ng-bind-html-unsafe='cvtDesc' /></v1collapse>" +
					"</div>",
			controller: function($scope) {
				var converter = new Markdown.getSanitizingConverter();

				$scope.$watch('src', function(val) {
					if (val && val.description) {
						$scope.cvtDesc = converter.makeHtml(val.description);
					}
					else
					{
						$scope.cvtDesc = '';
					}
				});
			}
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
					switch (item.mimetype.split('/')[0]) {
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
	directive('mediacontent', function($timeout, $window) {
		return {
			restrict: 'E',
			require: '^media',
			scope: { src: '=src'},
			templateUrl: 'tpl/mediaContent.html',
			replace: true,
			controller: function($scope,$element) {
				$scope.getType = function() {
					return $scope.src.mimetype.split('/')[0];
				};

				$scope.isVideo = function() {
					return ($scope.getType() == 'video');
				}

				$scope.getId = function() {
					return $scope.itemId;
				};

				$scope.setVideoSize = function() {
					var newWidth = $element[0].parentNode.parentNode.offsetWidth;
					var aspectRatio = 504 / 640;
					$scope.video.size(newWidth, newWidth * aspectRatio);
				}

				$scope.itemId = $scope.src.href.split('/').pop();

				angular.element($window).bind('resize', function() {
					if ($scope.getType() == 'video') {
						$scope.setVideoSize();
					}
				});

			},
			link: function postLink($scope, $element) {
				$timeout(function() {
					if ($scope.isVideo()) {
						$scope.video = _V_($scope.itemId);
						$scope.setVideoSize();
						$scope.$watch('src.active', function(active) {
							if (!active) {
								$scope.video.pause();
							} 
						});
					}
				});
			}
		};
	}).
	directive('updates', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { src: '=src' },
			templateUrl: 'tpl/updates.html',
			replace: true,
			controller: function($scope,$element) {
				var converter = new Markdown.getSanitizingConverter();
				var collapsedLength = 3;
				var isCollapsed = true;
				var isCollapsible = false;

				$scope.visibleUpdates = collapsedLength;

				$scope.getToggleText = function() {
					if (isCollapsed) {
						return "Show All Updates";
					} else {
						return "Show Fewer Updates";
					}
				}

				$scope.toggleUpdateList = function() {
					if (isCollapsed) {
						$scope.visibleUpdates = $scope.src.updates.length;
					} else {
						$scope.visibleUpdates = collapsedLength;
					}
					isCollapsed = !isCollapsed;
				}

				function convert(txt) {
					if (txt) {
						return converter.makeHtml(txt);
					}
					else
					{
						return '';
					}
				}


				$scope.$watch('src', function(val) {
					if (val) {
						for (var i = 0; i< val.updates.length; i++) {
							var entry = val.updates[i];
							entry.cvtDescription = convert(entry.description);
							entry.cvtReleaseNotes = convert(entry.releaseNotes);
						}
						$scope.isCollapsible = (val.updates.length > collapsedLength);
					}
				});
			}
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
	}).
	directive('v1collapse',function() {
		return {
			restrict: 'E',
			transclude: true,
			scope: { collapsedHeight: '=collapsedheight'},
			replace: true,
			template: "<div>" +
			"	<div collapse='isCollapsed' collapsed-height={{collapsedHeight}} ng-transclude></div>" +
			"	<div class='collapse-toggle' " +
			"		ng-show = 'isCollapsible()' " +
			"		ng-click='isCollapsed = !isCollapsed'>" +
			"			{{getToggle();}}" +
			"</div>" +
			"</div>",
			controller: function($scope,$element) {
				$scope.isCollapsed = false;

				$scope.isCollapsible = function()  {
					return $scope.isCollapsed || 
						($element[0].scrollHeight > $scope.collapsedHeight);
				}

				$scope.getToggle = function() {
					if ($scope.isCollapsed) {
						return "<< Expand >>";
					} else {
						return ">> Collapse <<";
					}
				}
			}
		};
	}).
	directive('sectionnav', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { src: '=src'},
			replace: true,
			template: "<div>" +
			"	<a class='btn' href='#media'>Media</a>" +
			"</div>",
			controller: function($scope,$element) {
				
			}
		};
	});