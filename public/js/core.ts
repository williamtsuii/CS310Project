
/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />
/// <reference path="../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts" />

// Main module for the app

module comicSans {

    var currentUserId;
    var comicId;
    var viewingId;
    // Routing of the app using routeProvider

    function routes($routeProvider: ng.route.IRouteProvider) {
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
    class MainCtrl {
        static $inject = ['$scope', 'userService', 'pageService'];
        constructor($scope, User: userService, Page: pageService) {
            console.log('MainCtrl loaded!');
            var main = this;
            $scope.Page = Page;
            $scope.User = User;
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
        submit(form : any){
            //console.log(form);
            this.User.signup(form)
                .success(function(data){
                    currentUserId  = data;
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
        constructor($scope, User: userService, Page: pageService, Comic: comicService) {
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.Comic = Comic;
            console.log(currentUserId);
            this.viewProfile(currentUserId, $scope);
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
                        console.log(data);
                        var arr = Object.keys(data).map(function(key) { return data[key] });
                        for (var i = 0; i < arr.length; i++) {
                            c.viewComic(arr[i]).success(function(data) {
                                $scope.comicsObjects.push(data.image);
                                console.log(data.image);
                                //console.log(JSON.parse(data.image));
                                //console.log($scope.comicsObjects);
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
                .success(function(){
                    viewingId =  comicId;
                    window.location.replace('/#/comic');
                });

        }

        save(form: any) {
            var comicImg = this.canvas.toJSON();
            form.push({comicImg});
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
            console.log('comicController loaded!');
            this.User = User;
            this.Comic = Comic;
            this.view(viewingId, $scope);
            $scope.comic = this;
        }

        view(id: string, $scope) {
            console.log('viewComic');
            this.Comic.viewComic(id)
                .success(function(data) {
                    $scope.comicData = data;
                    //console.log(data);
                });

        }
        addFavourite(){
            var comicJson = {id: viewingId};
            console.log(comicJson);
            this.User.addFavourite(currentUserId, comicJson)
                .error(function (error) {
                    console.log(error);
                });

            window.location.replace('/#/profile');
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
        }
        /*
        generateSearch() {
            this.Search.newSearch()
               .success(function(data) {
                   console.log('generating new search');
                   window.localStorage.setItem('searchTerm', data);
                   console.log(data);
                  // this.Search.searchAllComics(data)
                  //     .success(function(data) {
                  //         window.location.replace('/#/search');
                  //     });
               });
        }*/
        /*
        submit(form: string) {
        
            console.log("submitted search string: " + form);
            this.Search.searchAllComics(form)
                .success(function(data) {

                    window.location.replace('/#/search');
                });
        } */
        
        submit(search: string,$scope: any) {
            console.log("generating a new search of comics");
            this.Search.searchAllComics(search)
                .success(function(data) {
                    
                   //$scope.titles = data;
                    
                    console.log(data);
                    window.location.replace('/#/search');
                    console.log("submitting search term is successful");
                    window.localStorage.setItem('searchTerm', data);
                    window.location.replace('/#/search');
                });
        }


     
    }

    class searchService {
        static $inject = ['$http'];
        private tag: string;
        constructor(private $http: ng.IHttpService) {
        }

        /*
        newSearch(): ng.IPromise<any> {
             return this.$http.get('/new/search');
        }*/
        searchAllComics(search:string): ng.IPromise<any> {          
            return this.$http.get('/comic/search/' + search);
        }
    }

    class comicService {
        static $inject = ['$http'];
        constructor(private $http: ng.IHttpService) {
        }
        makeComic(comicData: any): ng.IPromise<any>{
            return this.$http.post('/comic/createcomic/'+ comicId, comicData);
        }
        saveComic(comicData: any): ng.IPromise<any>{
            return this.$http.post('/comic/savecomic/'+ comicId, comicData);
        }
        viewComic(comicId: any): ng.IPromise<any> {
            return this.$http.get('/comic/view/' + comicId);
        }
        newComic(): ng.IPromise<any> {
            return this.$http.get('/comic/newcomic');
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


