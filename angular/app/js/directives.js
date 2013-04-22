'use strict';

/* Directives */


angular.module('appCatalog.directives', []).
	directive('apptitle', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { app: '=appl' },
			replace: true,
			template: "<div class='titleView'>" +
				    "<h1 class='title'>{{app.name}}</h1>" +
				    "<div class='version'></div>" +
				    "<div class='author'></div>" +
				    "<div class='summary'>{{app.summary}}</div>" +
				    "<div class='callToAction'><a href='{{app.textLinks[0].href}}'' class='btn download'>{{app.textLinks[0].title}}</a>" +
				    "</div>"
		};
	}).
	directive('qualifiers', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { app: '=appl' },
			replace: true,
			template: "<div class='qualifiers cost'><b class='costLabel'>Cost:</b> {{app.cost}}</div>"
		};
	}).
	directive('description', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { app: '=appl' },
			replace: true,
			template: "<div class='description'>" +
					"<h2>Details</h2>" +
					"<p><a href='{{app.support.href}}'>{{app.support.title}}</a></p>" +
					"<p>{{app.description}}</p>" +
				"</div>"
		};
	}).
	directive('media', function() {
		return {
			restrict: 'E',
			scope: { contents: '=contents' },
			replace: true,
			/*Temporarily exclude custom elements, because they don't display correctly yet*/
			template: "<div><carousel interval=-1>" +
		    		"<slide ng-repeat = 'slide in contents | filter: isCustom=false' active='slide.active'>" +
		    		"<v1slide item=slide />" +
		    		"</slide>" +
		    	"</carousel></div>"
		};
	}).
	directive('v1slide', ['$compile', function(compile) {
		return {
			restrict: 'E',
			scope: {slide: '=item'},
			link: function(scope, element, attrs) {
				var strTemplate = '<div>';
				var item = scope.slide;
				if (item.isCustom) {
					strTemplate += item.content;
				}
				else
				{
					strTemplate += "<img ng-src='{{slide.href}}'/>"
				}
				strTemplate += 	
					"	<div class='carousel-caption'>" +
		    		"		<h4>{{slide.title}}</h4>" +
		    		"		<p>{{slide.title}}</p>" +
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
			scope: { app: '=appl' },
			replace: true,
			template: "<div><h2>Updates</h2>" +
				"<div ng-repeat = 'update in app.updates'>" +
				"        <div>" +
				"            <p>{{update.date | date:'fullDate'}} - {{update.version}}</p>" +
				"            <p>{{update.description}}</p>" +
				"        </div>" +
				"        <div>" +
				"            <p>Quality Band: <a " +
				 "               data-qualityBand='{{update.qualityBand}}'" +
				"                class='qualityBandPopover'" +
				"                >{{update.qualityBand}}</a>" +
				"            </p>" +
				"            <p>" +
				"                <a" +
				"                    href='{{w.downloadUrl}}'" +
				"                    class='btn download'" +
				"                >Download</a>" +
				"            </p>" +
				"        </div>" +
				"    <hr ng-show=' ! $last '/>" +
				"</div></div>"
		};
	}).
	directive('textlinks', function() {
		return {
			restrict: 'E',
			transclude: false,
			scope: { app: '=appl'},
			replace: true,
			template: "<ul class='textLinks nav nav-tabs nav-stacked'>" +
				    "    <li ng-repeat = 'link in app.textLinks'>" +
				    "        <a href='{{link.href}}'>" +
				    "            <img ng-src='img/{{link.type}}.png'>" +
				    "            {{link.title}}" +
				    "        </a>" +
				    "    </li>" +
					"</ul>" 
		};
	});