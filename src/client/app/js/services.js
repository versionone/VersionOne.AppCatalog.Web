'use strict';

/* Services */

angular.module('appCatalog.services', ['ngResource']).
	factory('App', function($resource) {
		var App = $resource("/entry");
		return App;
	});