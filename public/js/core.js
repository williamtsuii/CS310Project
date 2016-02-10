angular.module('scotchTodo', ['userService','pageService','ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/signup', {templateUrl: 'signup.html',   controller: signupController})
            .when('/home', {templateUrl:'home.html', controller:homeController})

            .when('/profile', {templateUrl:'profile.html', controller:profileController})

            .when('/create', {templateUrl:'create.html', controller:createController}) 
            .otherwise({redirectTo: '/home'});
    }]);

var id;
var u;

function MainCtrl($scope, Page, User) {
    console.log('MainCtrl loaded!');
    $scope.Page = Page;
    $scope.User = User;
}


function signupController($scope, User, Page) {
    Page.setTitle('Sign Up');
    $scope.formData = {};
    $scope.signupUser = function() {
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.email != undefined) {
            $scope.loading = true;

            // call the create function from our service (returns a promise object)
            User.signup($scope.formData)
                .success(function(data) {
                    id = data;
                    window.location.replace('/#/profile');
                    //console.log(data);
                    //$scope.formData = {}; // clear the form so our user is ready to enter another

                });
        }
    };
}


function profileController($scope, User, Page){
    console.log(id);
    Page.setTitle('Profile');
    User.view(id)
        .success(function(data){
            console.log(data);
        });
}

function createController($scope, Comic, Page) {
    Page.setTitle("New Comic");
    console.log(Page.title());
    $scope.formData = {};
    $scope.createComic = function() {
        console.log($scope.formData);
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        Comic.create($scope.formData)
            .success(function(data) {
                window.location.replace('/#/home');
                //$scope.formData = {}; // clear the form so our user is ready to enter another

                });
        }
}


function homeController($scope, User, Page){
    Page.setTitle('Home');
    $scope.user = {};
    $scope.loginUser = function(){
        console.log($scope.user.email);
        User.login($scope.user)
            .success(function (data) {
                u = $scope.user;
                console.log(u);
                id = data;
                $scope.user = {};

                window.location.replace('/#/profile');

            });
    }

}
