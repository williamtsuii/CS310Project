angular.module('scotchTodo', ['userService','ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/signup', {templateUrl: 'signup.html',   controller: signupController})
            .when('/home', {templateUrl:'home.html', controller:homeController})
            .when('/login',{templateUrl:'login.html', controller:loginController} )
            .when('/profile', {templateUrl:'profile.html', controller:profileController })
            .otherwise({redirectTo: '/home'});
    }]);

var id;
function MainCtrl() {
    console.log('MainCtrl loaded!');

}
function signupController($scope, User) {
    $scope.formData = {};
    $scope.signupUser = function() {
        console.log($scope.formData);
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.email != undefined) {
            $scope.loading = true;

            // call the create function from our service (returns a promise object)
            User.signup($scope.formData)
                .success(function(data) {
                    window.location.replace('/#/profile');
                    //$scope.formData = {}; // clear the form so our user is ready to enter another

                });
        }
    };
}


function loginController($scope,User){
    $scope.user = {};
    $scope.loginUser = function(){
        console.log($scope.user.email);
        User.login($scope.user)
            .success(function (data) {
                console.log(data);
                id = data;
                $scope.user = {};
                window.location.replace('/#/profile');
            });
    }

}

function profileController($scope, User){
    console.log(id);
    User.view(id)
        .success(function(data){
            console.log(data);
        });
}

function homeController(){
    console.log("hi");
}
