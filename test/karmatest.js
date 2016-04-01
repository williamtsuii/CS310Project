describe('subscribing to a user', function() {
	var scope;
	var ctrl;

	beforeEach(module('comicSans'));

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootSCope.$new();
		ctrl = $controller('searchController', {$scope: scope});
	}));

	it('should have an initial state of 123 in search box', function() {
		expect(scope.search).to.equal("123");
	});

	describe('search property', function() {
		beforeEach(function() {
			// we want it to have a default state of 123
			// and that it's able to change state to yield different search results
			sinon.stub(scope, 'Search', function() {});

			//A call to $apply() must be performed, otherwise 
			// scope's watcher won't be run through
			scope.$apply(function() {
				scope.search = 'asd';
			});
		});
	});

	it('should watch for search changes', function() {
		expect(scope.search).to.equal('asd');
	});

	

});