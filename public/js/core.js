angular.module('scotchTodo', ['userService','pageService','ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/signup', {templateUrl: 'signup.html',   controller: 'signupController as signUp'})
            .when('/home', {templateUrl:'home.html', controller:'homeController as home'})

            .when('/profile', {templateUrl:'profile.html', controller:'profileController as profile'})

            .when('/create', {templateUrl:'create.html', controller:'createController as create'})
            .otherwise({redirectTo: '/home'});
    }]);
var id;
var u;

function MainCtrl($scope, Page, User) {
    var main = this;
    console.log('MainCtrl loaded!');
    $scope.Page = Page;
    $scope.User = User;

}


function signupController($scope, User, Page) {
    var signUp = this;
    Page.setTitle('Sign Up');
    $scope.formData = {};
    $scope.signupUser = function() {
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if (signUp.formData.email != undefined) {
            User.signup(signUp.formData)
                .success(function(data) {
                    id = data;
                    window.location.replace('/#/profile');

                });
        }
    };
}


function profileController($scope, User, Page){
    var profile = this;
    console.log(id);
    Page.setTitle('Profile');
    User.view(id)
        .success(function(data){
            profile.user = data;
            console.log(profile.user.preferences);
        });
    $scope.createComic = function(){
        window.location.replace('/#/create');
    }
}

function createController($scope, Comic, Page) {
    Page.setTitle("New Comic");
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
    var home = this;
    Page.setTitle('Home');
    $scope.loginUser = function(){
        console.log(home.user.email);
        User.login(home.user)
            .success(function (data) {
                u = home.user;
                console.log(u);
                id = data;
                home.user = {};
                window.location.replace('/#/profile');
            });
    }

}
