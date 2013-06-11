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
  }]);