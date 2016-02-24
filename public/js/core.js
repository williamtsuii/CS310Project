/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />
// Main module for the app
var comicSans;
(function (comicSans) {
    // Routing of the app using routeProvider
    function routes($routeProvider) {
        $routeProvider
            .when('/signup', { templateUrl: 'signup.html', controller: 'signupController as signUp' })
            .when('/home', { templateUrl: 'home.html', controller: 'homeController as home' })
            .when('/profile', { templateUrl: 'profile.html', controller: 'profileController as profile' })
            .when('/create', { templateUrl: 'create.html', controller: 'createController as create' })
            .otherwise({ redirectTo: '/home' });
    }
    // MainCtrl that loads when the app loads
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
    // Controller for when user goes to signup page. Uses userService and pageService. Sets the page name to 'Sign Up'
    // and on click on submit button saves the id in local storage and redirects user to their profile.
    var signupController = (function () {
        function signupController($scope, User, Page) {
            $scope.signup = this;
            console.log('signupController loaded!');
            var signUp = this;
            $scope.Page.setTitle('Sign Up');
            this.User = User;
        }
        signupController.prototype.submit = function (form) {
            this.User.signup(form)
                .success(function (data) {
                console.log('hello');
                window.localStorage.setItem('id', data);
                window.location.replace('/#/profile');
            });
        };
        signupController.$inject = ['$scope', 'userService', 'pageService'];
        return signupController;
    })();
    // Controller for creating comics
    var createController = (function () {
        function createController($scope, User, Page) {
            $scope.Page.setTitle('Sign Up');
        }
        createController.$inject = ['$scope', 'userService', 'pageService'];
        return createController;
    })();
    //Constroller for homepage which also has login
    var homeController = (function () {
        function homeController($scope, User, Page) {
            $scope.home = this;
            console.log('homeController loaded!');
            $scope.Page.setTitle('Home');
            this.User = User;
        }
        homeController.prototype.submit = function (a) {
            this.User.login(a)
                .success(function (data) {
                this.u = a;
                window.localStorage.setItem('id', data);
                window.location.replace('/#/profile');
            });
        };
        homeController.$inject = ['$scope', 'userService', 'pageService'];
        return homeController;
    })();
    // Profile page controller
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
    // Service for signup, login and view users
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
    // Service that helps set title to pages so that they appear at the top of the page
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
//# sourceMappingURL=core.js.map