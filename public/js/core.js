<<<<<<< HEAD
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
    }());
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
    }());
    //Controller for homepage which also has login
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
                console.log('success');
            })
                .error(function (data) {
                console.log('hello');
                alert("error");
            });
        };
        homeController.$inject = ['$scope', 'userService', 'pageService'];
        return homeController;
    }());
    // Profile page controller
    var profileController = (function () {
        function profileController($scope, User, Page, Comic) {
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.Comic = Comic;
            this.viewProfile(window.localStorage.getItem('id'), $scope);
        }
        profileController.prototype.viewProfile = function (id, $scope) {
            //console.log('viewProfile');
            //console.log(s);
            var that = this;
            this.User.view(id)
                .success(function (data) {
                $scope.uProfile = data;
            });
        };
        profileController.prototype.createComic = function () {
            this.Comic.newComic()
                .success(function (data) {
                console.log('hello');
                window.localStorage.setItem('comicId', data);
                window.location.replace('/#/create');
            });
        };
        profileController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return profileController;
    }());
    // Controller for creating comics
    var createController = (function () {
        function createController($scope, User, Page, Comic) {
            $scope.Page.setTitle('Create Comics');
            console.log('createController loaded!');
            $scope.create = this;
            this.Comic = Comic;
        }
        createController.prototype.submit = function (form) {
            console.log(form);
            this.Comic.makeComic(form);

        createController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return createController;
    }());
    var comicService = (function () {
        function comicService($http) {
            this.$http = $http;
        }
        comicService.prototype.makeComic = function (comicData) {
            return this.$http.post('/comic/createcomic/' + window.localStorage.getItem('comicId'), comicData);
        };
        comicService.prototype.viewComic = function (comicId) {
            return this.$http.get('/comic/view/:comicID/' + comicId);
        };
        comicService.prototype.newComic = function () {
            return this.$http.get('/comic/newcomic');
        };
        comicService.$inject = ['$http'];
        return comicService;
    }());
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
    }());
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
    }());
    angular
        .module('comicSans', ['ngRoute', 'ngTagsInput'])
        .controller('MainCtrl', MainCtrl)
        .controller('homeController', homeController)
        .controller('signupController', signupController)
        .controller('profileController', profileController)
        .controller('createController', createController)
        .service('userService', userService)
        .service('pageService', pageService)
        .service('comicService', comicService)
        .config(routes);
})(comicSans || (comicSans = {}));
=======
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
    }());
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
    }());
    //Controller for homepage which also has login
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
                console.log('success');
            })
                .error(function (data) {
                console.log('hello');
                alert("error");
            });
        };
        homeController.$inject = ['$scope', 'userService', 'pageService'];
        return homeController;
    }());
    // Profile page controller
    var profileController = (function () {
        function profileController($scope, User, Page, Comic) {
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.Comic = Comic;
            this.viewProfile(window.localStorage.getItem('id'), $scope);
        }
        profileController.prototype.viewProfile = function (id, $scope) {
            //console.log('viewProfile');
            //console.log(s);
            var that = this;
            this.User.view(id)
                .success(function (data) {
                $scope.uProfile = data;
            });
        };
        profileController.prototype.createComic = function () {
            this.Comic.newComic()
                .success(function (data) {
                console.log('hello');
                window.localStorage.setItem('comicId', data);
                window.location.replace('/#/create');
            });
        };
        profileController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return profileController;
    }());
    // Controller for creating comics
    var createController = (function () {
        function createController($scope, User, Page, Comic) {
            $scope.Page.setTitle('Create Comics');
            console.log('createController loaded!');
            $scope.create = this;
            this.Comic = Comic;
        }
        createController.prototype.submit = function (form) {
            console.log(form);
            this.Comic.makeComic(form);
        };
        createController.prototype.tag = function (form) {
            $("#tags").tagit({
                availableTags: availableTags,
                autocomplete: { delay: 0, minLength: 1 },
                beforeTagAdded: function (event, ui) {
                    if ($.inArray(ui.tagLabel, availableTags) < 0) {
                        $('#error').show();
                        return false;
                    }
                    else {
                        $('#error').hide();
                    }
                }
            });
        };
        createController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return createController;
    }());
    var comicService = (function () {
        function comicService($http) {
            this.$http = $http;
        }
        comicService.prototype.makeComic = function (comicData) {
            return this.$http.post('/comic/createcomic/' + window.localStorage.getItem('comicId'), comicData);
        };
        comicService.prototype.viewComic = function (comicId) {
            return this.$http.get('/comic/view/:comicID/' + comicId);
        };
        comicService.prototype.newComic = function () {
            return this.$http.get('/comic/newcomic');
        };
        comicService.$inject = ['$http'];
        return comicService;
    }());
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
    }());
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
    }());
    angular
        .module('comicSans', ['ngRoute', 'ngTagsInput'])
        .controller('MainCtrl', MainCtrl)
        .controller('homeController', homeController)
        .controller('signupController', signupController)
        .controller('profileController', profileController)
        .controller('createController', createController)
        .service('userService', userService)
        .service('pageService', pageService)
        .service('comicService', comicService)
        .config(routes);
})(comicSans || (comicSans = {}));
>>>>>>> a464f2e80fc6950f6b661ba4c2bf39b39b7daeeb
