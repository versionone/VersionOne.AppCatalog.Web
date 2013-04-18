'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('appCatalog.services', ['ngResource']).
	factory('App', function($resource) {
		var App = $resource("http://appcatalog.azurewebsites.net/entry");
		return App;
	});