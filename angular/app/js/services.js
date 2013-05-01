'use strict';

/* Services */

angular.module('appCatalog.services', ['ngResource']).
	factory('App', function($resource) {
		var App = $resource("http://appcatalog.azurewebsites.net/entry");
		return App;
	});