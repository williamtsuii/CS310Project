/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />

module comicSans {

    function routes($routeProvider : ng.route.IRouteProvider){
        $routeProvider
            .when('/signup', {templateUrl: 'signup.html',   controller: 'signupController as signUp'})
            .when('/home', {templateUrl:'home.html', controller:'homeController as home'})
            .when('/profile', {templateUrl:'profile.html', controller:'profileController as profile'})
            .when('/create', {templateUrl:'create.html', controller:'createController as create'})
            .otherwise({redirectTo: '/home'});
    }



    class MainCtrl{
        static $inject = ['$scope','userService','pageService'];
        constructor($scope,User: userService,Page: pageService){
            console.log('MainCtrl loaded!');
            var main = this;
            $scope.Page = Page;
            $scope.User = User;
        }

    }

    class signupController{
        static $inject = ['$scope','userService','pageService'];
        private User;
        constructor($scope, User: userService,Page: pageService){
            $scope.signup = this;
            console.log('signupController loaded!');
            var signUp = this;
            $scope.Page.setTitle('Sign Up');
            this.User = User;
        }
        submit(form : any){
            console.log(form);
            this.User.signup(form)
                .success(function(data){
                   console.log(data);
                    //window.localStorage.setItem('id',data);
                    //window.location.replace('/#/profile');
                });
        }

    }

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

    class homeController{
        static $inject = ['$scope','userService','pageService'];
        private User;
        private u: any;

        constructor($scope, User: userService,Page: pageService){
            $scope.home = this;
            console.log('homeController loaded!')
            $scope.Page.setTitle('Home');
            this.User = User;
            console.log(this.u);
        }

        submit(a:any){
            this.User.login(a)
                .success(function(data){
                    console.log(data);
                    console.log(a);
                    this.u = a;
                    window.localStorage.setItem('id',data);
                    console.log(window.localStorage.getItem('id'));
                    window.location.replace('/#/profile');

                });
            }

    }

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
    class profileController{
        static $inject = ['$scope','userService','pageService'];
        private User;
        private u;
        constructor($scope, User: userService,Page: pageService){
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.viewProfile(window.localStorage.getItem('id'));
            console.log(this.u);
            $scope.abc = this.u;
            //console.log(window.localStorage.getItem('id'));
        }
        viewProfile(s:string){
            //console.log('viewProfile');
            //console.log(s);
            this.User.view(s)
                .success(function(data){
                    console.log(data);
                    this.u = data;
                    console.log(this.u);
                });
        }
        createComic(){
            window.location.replace('/#/create');
        }
    }




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
    class userService{
        static $inject = ['$http'];
        constructor(private $http: ng.IHttpService){
        }

        signup(userData:any) :ng.IPromise<any>{
            return this.$http.post('/user/createuser', userData);
        }

        login(user:any):ng.IPromise<any>{
            return this.$http.put('/user/login', user);
        }

        view(id: string): ng.IPromise<any>{
            return this.$http.get('/user/profile'+ "/" + id);
        }

    }

    class pageService{
        static $inject = ['$http'];
        private title : string;
        constructor(){
            this.title = 'default';
        }
        getTitle():string{
            return this.title;
        }
        setTitle(newTitle:string){
            this.title = newTitle;
        }
    }



    angular
        .module('comicSans', ['ngRoute'])
        .controller('MainCtrl', MainCtrl)
        .controller('homeController', homeController)
        .controller('signupController', signupController)
        .controller('profileController', profileController)
        .service('userService', userService)
        .service('pageService', pageService)
        .config(routes);
}


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
