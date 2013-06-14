'use strict';

describe('services', function() {
    beforeEach(module('appCatalog.services'));

    beforeEach(inject(function($rootScope,$httpBackend,App) {
        scope = $rootScope.$new();
        app = App;
        httpB = $httpBackend;
        httpB.when('GET', '/entry?id=test').respond({test: 'test response'});
    }));

    it('should make a query', function() {
        httpB.expectGET('/entry?id=test');
        app.get({id:'test'},function(resp) {
        });
        httpB.flush();
    });

});