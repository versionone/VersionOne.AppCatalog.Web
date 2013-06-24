'use strict';

// Declare app level module which depends on filters, and services
angular.module('appCatalog', ['appCatalog.filters', 'appCatalog.services', 'appCatalog.directives', 'appCatalog.controllers', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});
    $routeProvider.when('/Details/:appId', {templateUrl: 'partials/details.html', controller: 'DetailsCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
