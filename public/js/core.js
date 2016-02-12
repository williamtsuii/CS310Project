/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />
var comicSans;
(function (comicSans) {
    function routes($routeProvider) {
        $routeProvider
            .when('/signup', { templateUrl: 'signup.html', controller: 'signupController as signUp' })
            .when('/home', { templateUrl: 'home.html', controller: 'homeController as home' })
            .when('/profile', { templateUrl: 'profile.html', controller: 'profileController as profile' })
            .when('/create', { templateUrl: 'create.html', controller: 'createController as create' })
            .otherwise({ redirectTo: '/home' });
    }
    var MainCtrl = (function () {
        function MainCtrl($scope, User, Page) {
            console.log('MainCtrl loaded!');
            var main = this;
            $scope.Page = Page;
            $scope.User = User;
        }
        MainCtrl.$inject = ['$scope', 'userService', 'pageService'];
        return MainCtrl;
    })();
    var signupController = (function () {
        function signupController($scope, User, Page) {
            $scope.signup = this;
            console.log('signupController loaded!');
            var signUp = this;
            $scope.Page.setTitle('Sign Up');
            this.User = User;
        }
        signupController.prototype.submit = function (form) {
            console.log(form);
            this.User.signup(form)
                .success(function (data) {
                console.log(data);
                window.localStorage.setItem('id', data);
                window.location.replace('/#/profile');
            });
        };
        signupController.$inject = ['$scope', 'userService', 'pageService'];
        return signupController;
    })();
    //
    //function signupController($scope, User, Page) {
    //    var signUp = this;
    //    Page.setTitle('Sign Up');
    //    $scope.formData = {};
    //    $scope.signupUser = function() {
    //        // validate the formData to make sure that something is there
    //        // if form is empty, nothing will happen
    //        if (signUp.formData.email != undefined) {
    //            User.signup(signUp.formData)
    //                .success(function(data) {
    //                    id = data;
    //                    window.location.replace('/#/profile');
    //
    //                });
    //        }
    //    };
    //}
    var homeController = (function () {
        function homeController($scope, User, Page) {
            $scope.home = this;
            console.log('homeController loaded!');
            $scope.Page.setTitle('Home');
            this.User = User;
            console.log(this.u);
        }
        homeController.prototype.submit = function (a) {
            this.User.login(a)
                .success(function (data) {
                console.log(data);
                console.log(a);
                this.u = a;
                window.localStorage.setItem('id', data);
                console.log(window.localStorage.getItem('id'));
                window.location.replace('/#/profile');
            });
        };
        homeController.$inject = ['$scope', 'userService', 'pageService'];
        return homeController;
    })();
    //function homeController($scope, User, Page){
    //    var home = this;
    //    Page.setTitle('Home');
    //    $scope.loginUser = function(){
    //        console.log(home.user.email);
    //        User.login(home.user)
    //            .success(function (data) {
    //                u = home.user;
    //                console.log(u);
    //                id = data;
    //                home.user = {};
    //                window.location.replace('/#/profile');
    //            });
    //    }
    //
    //}
    var profileController = (function () {
        function profileController($scope, User, Page) {
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.viewProfile(window.localStorage.getItem('id'), $scope);
            console.log($scope.abc);
        }
        profileController.prototype.viewProfile = function (s, $scope) {
            //console.log('viewProfile');
            //console.log(s);
            var that = this;
            this.User.view(s)
                .success(function (data) {
                console.log(data);
                $scope.abc = data;
                console.log($scope.abc);
                //return data;
            });
        };
        profileController.prototype.createComic = function () {
            window.location.replace('/#/create');
        };
        profileController.prototype.setU = function (a) {
        };
        profileController.$inject = ['$scope', 'userService', 'pageService'];
        return profileController;
    })();
    //function profileController($scope, User, Page){
    //    var profile = this;
    //    console.log(id);
    //    Page.setTitle('Profile');
    //    User.view(id)
    //        .success(function(data){
    //            profile.user = data;
    //            console.log(profile.user.preferences);
    //        });
    //    $scope.createComic = function(){
    //        window.location.replace('/#/create');
    //    }
    //}
    var userService = (function () {
        function userService($http) {
            this.$http = $http;
        }
        userService.prototype.signup = function (userData) {
            return this.$http.post('/user/createuser', userData);
        };
        userService.prototype.login = function (user) {
            return this.$http.put('/user/login', user);
        };
        userService.prototype.view = function (id) {
            return this.$http.get('/user/profile' + "/" + id);
        };
        userService.$inject = ['$http'];
        return userService;
    })();
    var pageService = (function () {
        function pageService() {
            this.title = 'default';
        }
        pageService.prototype.getTitle = function () {
            return this.title;
        };
        pageService.prototype.setTitle = function (newTitle) {
            this.title = newTitle;
        };
        pageService.$inject = ['$http'];
        return pageService;
    })();
    angular
        .module('comicSans', ['ngRoute'])
        .controller('MainCtrl', MainCtrl)
        .controller('homeController', homeController)
        .controller('signupController', signupController)
        .controller('profileController', profileController)
        .service('userService', userService)
        .service('pageService', pageService)
        .config(routes);
})(comicSans || (comicSans = {}));
//angular.module('comicSans', ['userService','pageService','ngRoute'])
//
//    .config(['$routeProvider', function($routeProvider) {
//        $routeProvider
//            .when('/signup', {templateUrl: 'signup.html',   controller: 'signupController as signUp'})
//            .when('/home', {templateUrl:'home.html', controller:'homeController as home'})
//
//            .when('/profile', {templateUrl:'profile.html', controller:'profileController as profile'})
//
//            .when('/create', {templateUrl:'create.html', controller:'createController as create'})
//            .otherwise({redirectTo: '/home'});
//    }]);
//var id;
//var u;
//
//function MainCtrl($scope, Page, User) {
//    var main = this;
//    console.log('MainCtrl loaded!');
//    $scope.Page = Page;
//    $scope.User = User;
//
//}
//
//
//
//
//function createController($scope, Comic, Page) {
//    Page.setTitle("New Comic");
//    $scope.createComic = function() {
//        console.log($scope.formData);
//        // validate the formData to make sure that something is there
//        // if form is empty, nothing will happen
//        Comic.create($scope.formData)
//            .success(function(data) {
//                window.location.replace('/#/home');
//                //$scope.formData = {}; // clear the form so our user is ready to enter another
//
//                });
//        }
//}
//
//
//function homeController($scope, User, Page){
//    var home = this;
//    Page.setTitle('Home');
//    $scope.loginUser = function(){
//        console.log(home.user.email);
//        User.login(home.user)
//            .success(function (data) {
//                u = home.user;
//                console.log(u);
//                id = data;
//                home.user = {};
//                window.location.replace('/#/profile');
//            });
//    }
//
//}
//# sourceMappingURL=core.js.map