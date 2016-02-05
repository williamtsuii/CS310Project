angular.module('userService', [])

	// super simple service
	// each function returns a promise object 
	.factory('User', ['$http',function($http) {
		return {
			signup : function(userData) {
				return $http.post('/user/createUser', userData);
			},
			login : function(){
				return $http.get('/user/newUser');
			}
		}
	}]);