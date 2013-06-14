'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    beforeEach(module('appCatalog.controllers'));
    beforeEach(module('appCatalog.services'));

    beforeEach(inject(function($controller,$rootScope,$httpBackend,App) {
        scope = $rootScope.$new();
        $httpBackend.when('GET', '/entry?id=test').respond({test: 'test response'});
        $httpBackend.when('GET', '/entry').respond([{test: 'test response'}]);
        app = App;
        detailsCtrl = $controller('DetailsCtrl', {$scope: scope, 
            $routeParams: {appId: 'test'}, 
            App: app});
        listCtrl = $controller('ListCtrl', {$scope: scope, 
            App: app});
    }));

    it('should load', function() {
        expect(detailsCtrl).toBeDefined();
        expect(listCtrl).toBeDefined();
    });
});