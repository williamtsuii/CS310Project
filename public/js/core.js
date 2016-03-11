/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />
/// <reference path="../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts" />
// Main module for the app
var comicSans;
(function (comicSans) {
    var currentUserId;
    var comicId;
    var viewingId;
    // Routing of the app using routeProvider
    function routes($routeProvider) {
        $routeProvider
            .when('/signup', { templateUrl: 'signup.html', controller: 'signupController as signUp' })
            .when('/home', { templateUrl: 'home.html', controller: 'homeController as home' })
            .when('/profile', { templateUrl: 'profile.html', controller: 'profileController as profile' })
            .when('/create', { templateUrl: 'create.html', controller: 'createController as create' })
            .when('/comic', { templateUrl: 'comic.html', controller: 'comicController as comic' })
            .when('/search', { templateUrl: 'search.html', controller: 'searchController as search' }) // William-- NOTE TO SELF: created 03/09/2016 
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
            //console.log(form);
            this.User.signup(form)
                .success(function (data) {
                currentUserId = data;
                //window.localStorage.setItem('id',data)
                window.location.replace('/#/profile');
            });
        };
        signupController.$inject = ['$scope', 'userService', 'pageService'];
        return signupController;
    })();
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
                currentUserId = data;
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
    })();
    // Profile page controller
    var profileController = (function () {
        function profileController($scope, User, Page, Comic) {
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.Comic = Comic;
            console.log(currentUserId);
            this.viewProfile(currentUserId, $scope);
        }
        profileController.prototype.viewProfile = function (id, $scope) {
            var u = this.User;
            var c = this.Comic;
            $scope.comicsObjects = [];
            this.User.view(id)
                .success(function (data) {
                $scope.uProfile = data;
                u.getFavourites(id).success(function (data) {
                    var arr = Object.keys(data).map(function (key) { return data[key]; });
                    for (var i = 0; i < arr.length; i++) {
                        c.viewComic(arr[i]).success(function (data) {
                            $scope.comicsObjects.push(data);
                            console.log($scope.comicsObjects);
                        });
                    }
                });
            });
        };
        profileController.prototype.createComic = function () {
            this.Comic.newComic()
                .success(function (data) {
                console.log('hello');
                comicId = data;
                //window.localStorage.setItem('comicId',data);
                window.location.replace('/#/create');
            });
        };
        profileController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return profileController;
    })();
    // Controller for creating comics
    var createController = (function () {
        function createController($scope, User, Page, Comic) {
            $scope.Page.setTitle('Create Comics');
            console.log('createController loaded!');
            $scope.create = this;
            this.Comic = Comic;
            this.canvas = new fabric.Canvas('c');
            console.log(this.canvas);
            this.canvas.setHeight(400);
            this.canvas.setWidth(600);
        }
        createController.prototype.submit = function (form) {
            console.log(form);
            var comicImg = this.canvas.toDataURL({
                format: "png"
            });
            form.data = comicImg;
            console.log(form);
            this.Comic.makeComic(form)
                .success(function () {
                viewingId = comicId;
                window.location.replace('/#/comic');
            });
        };
        createController.prototype.save = function (form) {
            var comicImg = this.canvas.toJSON();
            form.push({ comicImg: comicImg });
            this.Comic.saveComic(form, comicImg)
                .success(function () {
                window.localStorage.setItem('viewingId', window.localStorage.getItem('comicId'));
                window.location.replace('/#/comic');
            });
        };
        createController.prototype.clearCanvas = function () {
            this.canvas.clear();
        };
        createController.prototype.addImage = function (image) {
            console.log("adding image");
            console.log(this.canvas);
            var Image = image.target.files[0];
            var reader = new FileReader();
            var canvas = this.canvas;
            //reader.onload = $scope.imageIsLoaded;
            reader.onloadend = function load(e) {
                var canvas1 = canvas;
                fabric.Image.fromURL(e.target.result, function add(oImg) {
                    oImg.scale(0.1);
                    canvas1.add(oImg);
                });
            };
            reader.readAsDataURL(Image);
        };
        createController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return createController;
    })();
    var comicController = (function () {
        function comicController($scope, User, Page, Comic) {
            console.log('comicController loaded!');
            this.User = User;
            this.Comic = Comic;
            this.view(viewingId, $scope);
            $scope.comic = this;
        }
        comicController.prototype.view = function (id, $scope) {
            console.log('viewComic');
            this.Comic.viewComic(id)
                .success(function (data) {
                $scope.comicData = data;
                //console.log(data);
            });
        };
        comicController.prototype.addFavourite = function () {
            var comicJson = { id: viewingId };
            console.log(comicJson);
            this.User.addFavourite(currentUserId, comicJson)
                .error(function (error) {
                console.log(error);
            });
        };
        comicController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return comicController;
    })();
    var searchController = (function () {
        function searchController($scope, Page, Comic, Search) {
            $scope.search = this;
            $scope.Page.setTitle("Comic search");
            console.log("searchController loaded!");
            this.Keyword = Search;
        }
        searchController.prototype.submit = function (search) {
            console.log(search);
            this.Keyword.searchAllComics(search)
                .success(function (data) {
                console.log("submitting search term is successful");
                window.localStorage.setItem('searchTerm', data);
                window.location.replace('/#/search');
            });
        };
        searchController.$inject = ['$scope', 'pageService', 'comicService', 'searchService'];
        return searchController;
    })();
    var searchService = (function () {
        function searchService($http) {
            this.$http = $http;
        }
        searchService.prototype.viewSearch = function (text) {
            return this.$http.post('/comic/search/', text);
        };
        searchService.prototype.searchAllComics = function (searchTerm) {
            return this.$http.get('/comic/search' + "/" + searchTerm);
        };
        searchService.$inject = ['$http'];
        return searchService;
    })();
    var comicService = (function () {
        function comicService($http) {
            this.$http = $http;
        }
        comicService.prototype.makeComic = function (comicData) {
            return this.$http.post('/comic/createcomic/' + comicId, comicData);
        };
        comicService.prototype.saveComic = function (comicData) {
            return this.$http.post('/comic/savecomic/' + comicId, comicData);
        };
        comicService.prototype.viewComic = function (comicId) {
            return this.$http.get('/comic/view/' + comicId);
        };
        comicService.prototype.newComic = function () {
            return this.$http.get('/comic/newcomic');
        };
        comicService.$inject = ['$http'];
        return comicService;
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
        userService.prototype.getFavourites = function (id) {
            return this.$http.get('/user/getFavourite/' + id);
        };
        userService.prototype.view = function (id) {
            return this.$http.get('/user/profile' + "/" + id);
        };
        userService.prototype.addFavourite = function (id, comicId) {
            console.log('add');
            return this.$http.post('/user/favourites/' + id, comicId);
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
        .module('comicSans', ['ngRoute', 'ngTagsInput'])
        .controller('MainCtrl', MainCtrl)
        .controller('homeController', homeController)
        .controller('signupController', signupController)
        .controller('profileController', profileController)
        .controller('createController', createController)
        .controller('comicController', comicController)
        .controller('searchController', searchController)
        .service('searchService', searchService)
        .service('userService', userService)
        .service('pageService', pageService)
        .service('comicService', comicService)
        .config(routes);
})(comicSans || (comicSans = {}));
