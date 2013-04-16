'use strict';

/* Controllers */

angular.module('appCatalog.controllers', []).
  controller('ListCtrl', [function() {

  }])
  .controller('DetailsCtrl', ['$scope','$routeParams','App',function($scope,$routeParams,App) {
  		App.get( {staticId:$routeParams.appId}, function(app) {
  			$scope.app = app;
  		});
  }]);