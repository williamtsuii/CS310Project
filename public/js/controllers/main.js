angular.module('todoController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','User', function($scope, $http, User) {
		$scope.formData = {};
		$scope.loading = true;


		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.signupUser = function() {
			console.log($scope.formData);
			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.email != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				User.signup($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};
	}]);