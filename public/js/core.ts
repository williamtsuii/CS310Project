
/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />
/// <reference path="../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts" />

// Main module for the app

module comicSans {

    var currentUserId;
    var comicId;
    var viewingId;
    var authorId;
    // Routing of the app using routeProvider

    function routes($routeProvider: ng.route.IRouteProvider) {
        $routeProvider
            .when('/signup', { templateUrl: 'signup.html', controller: 'signupController as signUp' })
            .when('/home', { templateUrl: 'home.html', controller: 'homeController as home' })
            .when('/2home', { templateUrl: '2home.html', controller: 'searchController as search' })
            .when('/profile', { templateUrl: 'profile.html', controller: 'profileController as profile' })
            .when('/create', { templateUrl: 'create.html', controller: 'createController as create' })
            .when('/comic', { templateUrl: 'comic.html', controller: 'comicController as comic' })
            .when('/search', { templateUrl: 'search.html', controller: 'searchController as search' }) // William-- NOTE TO SELF: created 03/09/2016 
            .otherwise({ redirectTo: '/home' });
    }


    // MainCtrl that loads when the app loads
    class MainCtrl {
        static $inject = ['$scope', 'userService', 'pageService'];
        constructor($scope, User: userService, Page: pageService) {
            console.log('MainCtrl loaded!');
            var main = this;
            $scope.Page = Page;
            $scope.User = User;

            $scope.reload = function refresh() {

                setTimeout(function() {
                    location.reload()
                }, 100);
            }
        }
        
    }


    // Controller for when user goes to signup page. Uses userService and pageService. Sets the page name to 'Sign Up'
    // and on click on submit button saves the id in local storage and redirects user to their profile.
    class signupController {
        static $inject = ['$scope', 'userService', 'pageService'];
        private User;
        constructor($scope, User: userService, Page: pageService) {
            $scope.signup = this;
            console.log('signupController loaded!');
            var signUp = this;
            $scope.Page.setTitle('Sign Up');
            this.User = User;
        }
        submit(form: any) {
            //console.log(form);
            this.User.signup(form)
                .success(function(data) {
                    currentUserId = data;
                    //window.localStorage.setItem('id',data)
                    window.location.replace('/#/profile');
                });
        }

    }




    //Controller for homepage which also has login
    class homeController {
        static $inject = ['$scope', 'userService', 'pageService'];
        private User;
        private u: any;
        constructor($scope, User: userService, Page: pageService) {
            $scope.home = this;
            console.log('homeController loaded!');
            $scope.Page.setTitle('Home');
            this.User = User;
        }

        submit(a: any) {
            this.User.login(a)
                .success(function(data) {
                    this.u = a;
                    currentUserId = data;
                    window.location.replace('/#/profile');
                    console.log('success');

                })
                .error(function(data) {
                    console.log('hello');
                    alert("error");
                });
        }

    }

    class profileController {
        static $inject = ['$scope', 'userService', 'pageService', 'comicService'];
        private User;
        private Comic;
        public getClickedComic;
        constructor($scope, User: userService, Page: pageService, Comic: comicService) {
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.Comic = Comic;
            console.log(currentUserId);
            this.viewProfile(currentUserId, $scope);
            getClickedComic = function(id) {
                viewingId = id;
                console.log(viewingId);
                console.log(id);
                window.location.replace('/#/comic');
            }

            User.getSubscriptions()
                .success(function(data) {
                    $scope.authors = data;
                    console.log("subscriptions: " + data);                    
                });

            

        }



        viewProfile(id: string, $scope) {
            var u = this.User;
            var c = this.Comic;
            $scope.comicsObjects = [];

            this.User.view(id)
                .success(function(data) {
                    $scope.uProfile = data;
                    console.log(data);
                    u.getFavourites(id).success(function(data) {
                        var arr = Object.keys(data).map(function(key) { return data[key] });
                        var faveDiv = document.getElementById("faveContainer");
                        for (var i = 0; i < arr.length; i++) {
                            c.viewComic(arr[i]).success(function(data) {
                                var DOM_a = document.createElement("a");
                                var DOM_img = document.createElement("img");
                                DOM_img.src = data.image;
                                DOM_img.style.height = '500px';
                                DOM_img.style.width = '500px';
                                DOM_a.appendChild(DOM_img);
                                DOM_a.href = 'javascript:getClickedComic(' + '"' + data.id + '"' + ')';
                                faveDiv.appendChild(DOM_a);
                            });

                        }
                    });
                });
        }



        createComic() {
            this.Comic.newComic()
                .success(function(data) {
                    console.log('hello');
                    comicId = data;
                    //window.localStorage.setItem('comicId',data);
                    window.location.replace('/#/create');
                });
        }
    }

    // Controller for creating comics
    class createController {
        static $inject = ['$scope', 'userService', 'pageService', 'comicService'];
        private Comic;
        private canvas;
        constructor($scope, User: userService, Page: pageService, Comic: comicService) {
            $scope.Page.setTitle('Create Comics');
            console.log('createController loaded!');
            $scope.create = this;
            this.Comic = Comic;
            this.canvas = new fabric.Canvas('c');
            console.log(this.canvas);
            this.canvas.setHeight(400);
            this.canvas.setWidth(600);
        }

        submit(form: any) {
            console.log(form);
            var comicImg = this.canvas.toDataURL({
                format: "png"
            });
            form.image = comicImg;
            console.log(form);
            this.Comic.makeComic(form)
                .success(function() {
                    viewingId = comicId;
                    window.location.replace('/#/comic');
                });

        }

        save(form: any) {
            var comicImg = this.canvas.toJSON();
            form.push({ comicImg });
            this.Comic.saveComic(form, comicImg)
                .success(function() {
                    window.localStorage.setItem('viewingId', window.localStorage.getItem('comicId'));
                    window.location.replace('/#/comic');
                });
        }

        clearCanvas() {
            this.canvas.clear();
        }

        addImage(image: any) {
            console.log("adding image");
            console.log(this.canvas);
            var Image = image.target.files[0];
            var reader = new FileReader();
            var canvas = this.canvas;
            //reader.onload = $scope.imageIsLoaded;
            reader.onloadend = function load(e: any) {
                var canvas1 = canvas;
                fabric.Image.fromURL(e.target.result, function add(oImg) {
                    oImg.scale(0.1);
                    canvas1.add(oImg);
                });
            };
            reader.readAsDataURL(Image);
        }
    }

    class comicController {
        static $inject = ['$scope', 'userService', 'pageService', 'comicService'];
        private Comic;
        private User;
        constructor($scope, User: userService, Page: pageService, Comic: comicService) {
            $scope.Page.setTitle('Comics');
            console.log('comicController loaded!');
            this.User = User;
            this.Comic = Comic;
            var showStar = this.isFavourite(viewingId);
            this.view(viewingId, $scope, showStar);
            $scope.comic = this;
            $scope.user = this.User;
            this.getComments(viewingId, this.User, $scope);
        }

        view(id: string, $scope, callback) {
            console.log('viewComic');
            this.Comic.viewComic(id)
                .success(function(data) {
                    $scope.comicData = data;
                    callback();
                });
        }
        isFavourite(cid: any) {
            var flag = false;
            var favourites;
            this.User.getFavourites(currentUserId)
                .success(function(data) {
                    favourites = Object.keys(data).map(function(key) { return data[key] });
                    for (var i = 0; i < favourites.length; i++) {
                        if (favourites[i] == cid) {
                            flag = true;
                        }
                        if (flag) {
                            document.getElementById("on").style.display = 'none';
                            document.getElementById("off").style.display = 'block';
                        } else {
                            document.getElementById("on").style.display = 'block';
                            document.getElementById("off").style.display = 'none';
                        }
                    }
                });

        }


        addFavourite() {
            var comicJson = { id: viewingId };
            console.log(comicJson);
            this.User.addFavourite(currentUserId, comicJson)
                .error(function(error) {
                    console.log(error);
                });

            window.location.replace('/#/profile');
        }

        subscribe(id: string, $scope) {
            console.log(id);
            this.User.subscribe(id)
                .success(function(data) {
                    alert("You have successfully subscribed to the author of this comic");
                });

        }

        addComment(comment) {
            var commentText = comment.text;
            var commentAuthorId = currentUserId;
            var commentObject = { author: commentAuthorId, text: commentText };
            console.log(commentObject);
            this.Comic.addComment(viewingId, commentObject)
                .success(function(error) {
                    console.log(error);
                });
        }

        getComments(id, user, $scope) {
            var allComments = [];
            this.Comic.getComments(id)
                .success(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        var commentText = data[i].text;
                        var authId = data[i].author;
                        user.view(authId)
                            .success(function(data) {
                                var name = data.username;
                                var commentObj = { auth: name, comm: commentText };
                                allComments.push(commentObj);
                            });
                    }
                    $scope.allComments = allComments;
                });
        }
    }



    class searchController {
        static $inject = ['$scope', 'pageService', 'comicService', 'searchService'];
        private Search;
        private Comic;
        constructor($scope, Page: pageService, Comic: comicService, Search: searchService) {
            $scope.search = this;
            $scope.Page.setTitle("Comic search");
            console.log("searchController loaded!");
            this.Comic = Comic;
            this.Search = Search;
            $scope.comicCtrl = this.Comic;

            $scope.searchedComics = [];
            $scope.search = "123";
            $scope.comics = null;

            Search.getComics()
                .success(function(data) {
                    $scope.allComics = JSON.parse(JSON.stringify(data));
                });

            $scope.sentHTTP = function(content) {
                //payload creation, HTTP request, etc;
            };
        }       

    }

    class searchService {
        static $inject = ['$http'];
        private tag: string;
        constructor(private $http: ng.IHttpService) {
        }
        searchAllComics(search: string): ng.IPromise<any> {
            return this.$http.get('/comic/search/' + search);
        }
        getComics(): ng.IPromise<any> {
            return this.$http.get('comic/search');
        }
    }

    class comicService {
        static $inject = ['$http'];
        constructor(private $http: ng.IHttpService) {
        }
        makeComic(comicData: any): ng.IPromise<any> {
            return this.$http.post('/comic/createcomic/' + comicId, comicData);
        }
        saveComic(comicData: any): ng.IPromise<any> {
            return this.$http.post('/comic/savecomic/' + comicId, comicData);
        }
        viewComic(comicId: any): ng.IPromise<any> {
            return this.$http.get('/comic/view/' + comicId);
        }
        newComic(): ng.IPromise<any> {
            return this.$http.get('/comic/newcomic');
        }
        addComment(comicId: string, comment: any): ng.IPromise<any> {
            return this.$http.post('/comic/addComment/' + comicId, comment)
        }
        getComments(comicId: string): ng.IPromise<any> {
            return this.$http.get('/comic/getComments/' + comicId);
        }
    }

    // Service for signup, login and view users
    class userService {
        static $inject = ['$http'];
        constructor(private $http: ng.IHttpService) {
        }

        signup(userData: any): ng.IPromise<any> {
            return this.$http.post('/user/createuser', userData);
        }

        login(user: any): ng.IPromise<any> {
            return this.$http.put('/user/login', user);
        }
        logout(): ng.IPromise<any> {
            return this.$http.get('/user/logout');
        }
        getFavourites(id: string): ng.IPromise<any> {
            return this.$http.get('/user/getFavourite/' + id);
        }

        view(id: string): ng.IPromise<any> {
            return this.$http.get('/user/profile' + "/" + id);
        }

        addFavourite(id: string, comicId: any): ng.IPromise<any> {
            console.log('add');
            return this.$http.post('/user/favourites/' + id, comicId);
        }
        subscribe(id: string): ng.IPromise<any> {
            console.log('subscribed to: ' + id);
            return this.$http.post('/user/subscribe/' + id, id);
        }
        getSubscriptions(): ng.IPromise<any> { 
            return this.$http.get('/user/subscriptions/');
        }



    }
    // Service that helps set title to pages so that they appear at the top of the page
    class pageService {
        static $inject = ['$http'];
        private title: string;
        constructor() {
            this.title = 'default';
        }
        getTitle(): string {
            return this.title;
        }
        setTitle(newTitle: string) {
            this.title = newTitle;
        }
    }



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



}

