
/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />
/// <reference path="../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts" />

// Main module for the app

module comicSans {

    var currentUserId;
    var comicId;
    var viewingId;
    var authorId;
    var photo;

    // Routing of the app using routeProvider

    function routes($routeProvider: ng.route.IRouteProvider) {
        $routeProvider
            .when('/signup', { templateUrl: 'signup.html', controller: 'signupController as signUp' })
            .when('/home', { templateUrl: 'home.html', controller: 'homeController as home' })
            .when('/2home', { templateUrl: '2home.html', controller: 'searchController as search' })
            .when('/profile', { templateUrl: 'profile.html', controller: 'profileController as profile' })
            .when('/create', { templateUrl: 'create.html', controller: 'createController as create' })
            .when('/comic', { templateUrl: 'comic.html', controller: 'comicController as comic' })
            .when('/edit', { templateUrl: 'edit.html', controller: 'editController as edit'})
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
            window.URL    = window.URL;
            var elBrowse  = document.getElementById("browse"),
                elPreview = document.getElementById("preview"),
                useBlob   = false && window.URL;
            elBrowse.addEventListener("change", function() {
                console.log('change');
                // Let's store the FileList Array into a variable:
                // https://developer.mozilla.org/en-US/docs/Web/API/FileList
                var files = this.files;
                // Let's create an empty `errors` String to collect eventual errors into:
                var errors = "";

                if (!files) {
                    errors += "File upload not supported by your browser.";
                }

                // Check for `files` (FileList) support and if contains at least one file:
                if (files && files[0]) {

                    // Iterate over every File object in the FileList array


                        // Let's refer to the current File as a `file` variable
                        // https://developer.mozilla.org/en-US/docs/Web/API/File
                        var file = files[0];

                        // Test the `file.name` for a valid image extension:
                        // (pipe `|` delimit more image extensions)
                        // The regex can also be expressed like: /\.(png|jpe?g|gif)$/i
                        if ( (/\.(png|jpeg|jpg|gif)$/i).test(file.name) ) {
                            // SUCCESS! It's an image!
                            // Send our image `file` to our `readImage` function!
                            readImage( file );
                        } else {
                            errors += file.name +" Unsupported Image extension\n";
                        }
                    }


                // Notify the user for any errors (i.e: try uploading a .txt file)
                if (errors) {
                    alert(errors);
                }

            });

            var readImage = function (file) {
                // 2.1
                // Create a new FileReader instance
                // https://developer.mozilla.org/en/docs/Web/API/FileReader
                var reader = new FileReader();

                // 2.3
                // Once a file is successfully readed:
                reader.addEventListener("load", function () {

                    // At this point `reader.result` contains already the Base64 Data-URL
                    // and we've could immediately show an image using
                    // `elPreview.insertAdjacentHTML("beforeend", "<img src='"+ reader.result +"'>");`
                    // But we want to get that image's width and height px values!
                    // Since the File Object does not hold the size of an image
                    // we need to create a new image and assign it's src, so when
                    // the image is loaded we can calculate it's width and height:
                    var image  = new Image();
                    image.addEventListener("load", function () {

                        // Concatenate our HTML image info
                        var imageInfo = file.name    +' '+ // get the value of `name` from the `file` Obj
                            image.width  +'×'+ // But get the width from our `image`
                            image.height +' '+
                            file.type    +' '+
                            Math.round(file.size/1024) +'KB';

                        // Finally append our created image and the HTML info string to our `#preview`
                        elPreview.appendChild( this );
                        elPreview.insertAdjacentHTML("beforeend", imageInfo +'<br>');
                    });

                    image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;

                    // If we set the variable `useBlob` to true:
                    // (Data-URLs can end up being really large
                    // `src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA...........etc`
                    // Blobs are usually faster and the image src will hold a shorter blob name
                    // src="blob:http%3A//example.com/2a303acf-c34c-4d0a-85d4-2136eef7d723"
                    if (useBlob) {
                        // Free some memory for optimal performance
                        window.URL.revokeObjectURL(file);
                    }
                });

                // 2.2
                // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
                reader.readAsDataURL(file);
                console.log(reader);
                reader.onloadend = function(){
                        photo = reader.result;
                        console.log(photo);
                }

            }
        }
        submit(form : any){
            form.photo = photo;
            console.log(form);
            this.User.signup(form)
                .success(function(data) {
                    currentUserId = data;
                    //window.localStorage.setItem('id',data)
                    window.location.replace('/#/profile');
                });
        }


    }


    class editController {
        static $inject = ['$scope', 'userService', 'pageService'];
        private User;
        constructor($scope, User: userService, Page: pageService) {
            console.log('edit Controller');
            $scope.edit = this;
            $scope.Page.setTitle(' Edit Profile');
            this.User = User;
            this.loadProfile(currentUserId, $scope);
        }

        loadProfile(id: string, $scope) {
            this.User.view(id)
                .success(function(data) {
                    $scope.editProfile = data;
                    console.log(data);
                    console.log($scope.editProfile);
                });
        }

        submit(form : any){

            this.User.edit(currentUserId, form)
                .success(function(data){

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
        editProfile(){
            console.log('hello');
            window.location.replace('/#/edit');
        }



        viewProfile(id: string, $scope) {
            var u = this.User;
            var c = this.Comic;
            $scope.comicsObjects = [];

            this.User.view(id)
                .success(function(data) {
                    c.getsSavedComics().success(function(data){
                        var everything = data;
                        for (var j = 0; j < everything.length; j++){
                            c.viewComic(everything[j]).success(function(data2) {
                                if (id == data2.author){

                                }
                            });
                        }
                    });
                    console.log(data.photo);
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
                    comicId = data;
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
            console.log(comicImg);
            form.image = comicImg;
            this.Comic.saveComic(form)
                .success(function() {
                    viewingId = comicId;
                    window.location.replace('/#/profile');
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
                    //canvas1.setActiveObject(oImg);
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
            var getcomments = this.getComments(viewingId, this.User, $scope);
            var showStar = this.isFavourite(viewingId, $scope, getcomments);
            this.view(viewingId, $scope, showStar);
            $scope.comic = this;
            $scope.user = this.User;
        }

        view(id: string, $scope, callback) {
            console.log('viewComic');
            this.Comic.viewComic(id)
                .success(function(data) {
                    $scope.comicData = data;
                    callback();
                });
        }
        isFavourite(cid: any, $scope, callback) {
            console.log("viewing id");
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
                        callback();
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
            console.log("asdfasd");
            this.Comic.getComments(id)
                .success(function(d){
                    var j = 0;
                    for (var i = 0; i < d.length; i++){
                        var authId = d[i].author;
                        user.view(authId)
                            .success(function(data){
                                var commentText = d[j].text;
                                var name = data.username;
                                var photo = data.photo;
                                var commentObj = {auth: name, comm: commentText, photo: photo};
                                allComments[j] = commentObj;
                                j++;
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
        public getInterestedComic;
        constructor($scope, Page: pageService, Comic: comicService, Search: searchService) {
            $scope.searcher = this;
            $scope.Page.setTitle("Comic search");
            console.log("searchController loaded!");
            this.Comic = Comic;
            this.Search = Search;
            $scope.comicCtrl = this.Comic;
            $scope.ComicData = Comic;

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


          //  c.viewComic(arr[i]).success(function(data) 

        }       
        
        passToGetComic(form: any, $scope) {
            console.log(form);
            this.Comic.viewComic(form)
                .success(function(data) {
                    //console.log(data);  
                    viewingId = data.id;
                    window.location.replace('/#/comic');
                });
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

        getsSavedComics() : ng.IPromise<any>{
            return this.$http.get('/comic/saved');
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

        edit(id: string, userData: any ) :  ng.IPromise<any> {
            return this.$http.put('/user/edit/' + id, userData);
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
        .controller('editController', editController)
        .service('searchService', searchService)
        .service('userService', userService)
        .service('pageService', pageService)
        .service('comicService', comicService)
        .config(routes);



}

