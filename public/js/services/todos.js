angular.module('userService', [])

	// super simple service
	// each function returns a promise object 
	.factory('User', ['$http',function($http) {
		return {
			signup : function(userData) {
				return $http.post('/user/createuser', userData);
			},
			login : function(user){
				return $http.put('/user/login', user);
			}
		}
	}]);