angular.module('scotchTodo', ['todoService','ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/signup', {templateUrl: 'signup.html',   controller: signupController})
            .when('/home', {templateUrl:'home.html', controller:homeController})
            .otherwise({redirectTo: '/home'});
    }]);


function MainCtrl() {
    console.log('MainCtrl loaded!');
}
function signupController($scope, $http, User) {
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
}


function homeController(){
    console.log("hi");
}
