angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('User', ['$http',function($http) {
		return {
			signup : function(userData) {
				return $http.post('/user/createUser', userData);
			}
		}
	}]);