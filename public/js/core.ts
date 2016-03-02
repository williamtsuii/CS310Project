/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />

// Main module for the app

module comicSans {

    // Routing of the app using routeProvider

    function routes($routeProvider : ng.route.IRouteProvider){
        $routeProvider
            .when('/signup', {templateUrl: 'signup.html',   controller: 'signupController as signUp'})
            .when('/home', {templateUrl:'home.html', controller:'homeController as home'})
            .when('/profile', {templateUrl:'profile.html', controller:'profileController as profile'})
            .when('/create', {templateUrl:'create.html', controller:'createController as create'})
            .otherwise({redirectTo: '/home'});
    }


    // MainCtrl that loads when the app loads
    class MainCtrl{
        static $inject = ['$scope','userService','pageService'];
        constructor($scope,User: userService,Page: pageService){
            console.log('MainCtrl loaded!');
            var main = this;
            $scope.Page = Page;
            $scope.User = User;
        }

    }


    // Controller for when user goes to signup page. Uses userService and pageService. Sets the page name to 'Sign Up'
    // and on click on submit button saves the id in local storage and redirects user to their profile.
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
            this.User.signup(form)
                .success(function(data){
                    console.log('hello');
                    window.localStorage.setItem('id',data);
                    window.location.replace('/#/profile');
                });
        }

    }

    // Controller for creating comics
    class createController{
        static $inject = ['$scope','userService','pageService'];
        constructor($scope, User: userService,Page: pageService){
            $scope.Page.setTitle('Sign Up');
        }
    }


    //Constroller for homepage which also has login
    class homeController{
        static $inject = ['$scope','userService','pageService'];
        private User;
        private u: any;

        constructor($scope, User: userService,Page: pageService){
            $scope.home = this;
            console.log('homeController loaded!')
            $scope.Page.setTitle('Home');
            this.User = User;
        }

        submit(a:any){
            this.User.login(a)
                .success(function(data){
                    this.u = a;
                    window.localStorage.setItem('id',data);
                    window.location.replace('/#/profile');

                });
            }

    }
    // Profile page controller
    class profileController{
        static $inject = ['$scope','userService','pageService'];
        private User;
        private u;
        constructor($scope, User: userService,Page: pageService){
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.viewProfile(window.localStorage.getItem('id'), $scope);
            console.log($scope.abc);
        }
        viewProfile(s:string, $scope){
            //console.log('viewProfile');
            //console.log(s);
            var that = this;
            this.User.view(s)
                .success(function(data){
                    console.log(data);
                    $scope.abc = data;
                    console.log($scope.abc);
                   //return data;
                });
        }
        createComic(){
            window.location.replace('/#/create');
        }

        setU(a : any){

        }
    }
    // Service for signup, login and view users
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
    // Service that helps set title to pages so that they appear at the top of the page
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