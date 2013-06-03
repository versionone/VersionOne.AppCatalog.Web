'use strict';

// Declare app level module which depends on filters, and services
angular.module('appCatalog', ['appCatalog.filters', 'appCatalog.services', 'appCatalog.directives', 'appCatalog.protodirectives', 'appCatalog.controllers', 'ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});
    $routeProvider.when('/DetailsOld/:appId', {templateUrl: 'partials/details-old.html', controller: 'DetailsCtrl'});
    $routeProvider.when('/Details/:appId', {templateUrl: 'partials/details.html', controller: 'DetailsCtrl'});
    $routeProvider.when('/Proto', {templateUrl: 'partials/details-proto.html', controller: 'ProtoCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
