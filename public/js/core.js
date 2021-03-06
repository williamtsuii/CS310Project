/// <reference path="../../types/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../types/DefinitelyTyped/angularjs/angular-route.d.ts" />
/// <reference path="../../types/DefinitelyTyped/fabricjs/fabricjs.d.ts" />
// Main module for the app
var comicSans;
(function (comicSans) {
    var currentUserId;
    var comicId;
    var viewingId;
    var authorId;
    var photo;
    // Routing of the app using routeProvider
    function routes($routeProvider) {
        $routeProvider
            .when('/signup', { templateUrl: 'signup.html', controller: 'signupController as signUp' })
            .when('/home', { templateUrl: 'home.html', controller: 'homeController as home' })
            .when('/2home', { templateUrl: '2home.html', controller: 'searchController as search' })
            .when('/profile', { templateUrl: 'profile.html', controller: 'profileController as profile' })
            .when('/create', { templateUrl: 'create.html', controller: 'createController as create' })
            .when('/comic', { templateUrl: 'comic.html', controller: 'comicController as comic' })
            .when('/edit', { templateUrl: 'edit.html', controller: 'editController as edit' })
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
            $scope.reload = function refresh() {
                setTimeout(function () {
                    location.reload();
                }, 100);
            };
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
            window.URL = window.URL;
            var elBrowse = document.getElementById("browse"), elPreview = document.getElementById("preview"), useBlob = false && window.URL;
            elBrowse.addEventListener("change", function () {
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
                    if ((/\.(png|jpeg|jpg|gif)$/i).test(file.name)) {
                        // SUCCESS! It's an image!
                        // Send our image `file` to our `readImage` function!
                        readImage(file);
                    }
                    else {
                        errors += file.name + " Unsupported Image extension\n";
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
                    var image = new Image();
                    image.addEventListener("load", function () {
                        // Concatenate our HTML image info
                        var imageInfo = file.name + ' ' +
                            image.width + '×' +
                            image.height + ' ' +
                            file.type + ' ' +
                            Math.round(file.size / 1024) + 'KB';
                        // Finally append our created image and the HTML info string to our `#preview`
                        elPreview.appendChild(this);
                        elPreview.insertAdjacentHTML("beforeend", imageInfo + '<br>');
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
                reader.onloadend = function () {
                    photo = reader.result;
                    console.log(photo);
                };
            };
        }
        signupController.prototype.submit = function (form) {
            form.photo = photo;
            console.log(form);
            this.User.signup(form)
                .success(function (data) {
                currentUserId = data;
                //window.localStorage.setItem('id',data)
                window.location.replace('/#/profile');
            });
        };
        signupController.$inject = ['$scope', 'userService', 'pageService'];
        return signupController;
    }());
    var editController = (function () {
        function editController($scope, User, Page) {
            console.log('edit Controller');
            $scope.edit = this;
            $scope.Page.setTitle(' Edit Profile');
            this.User = User;
            this.loadProfile(currentUserId, $scope);
        }
        editController.prototype.loadProfile = function (id, $scope) {
            this.User.view(id)
                .success(function (data) {
                $scope.editProfile = data;
                console.log(data);
                console.log($scope.editProfile);
            });
        };
        editController.prototype.submit = function (form) {
            this.User.edit(currentUserId, form)
                .success(function (data) {
                //window.localStorage.setItem('id',data)
                window.location.replace('/#/profile');
            });
        };
        editController.$inject = ['$scope', 'userService', 'pageService'];
        return editController;
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
    }());
    var profileController = (function () {
        function profileController($scope, User, Page, Comic) {
            $scope.profile = this;
            console.log('profileController loaded!');
            $scope.Page.setTitle('Profile');
            this.User = User;
            this.Comic = Comic;
            console.log(currentUserId);
            this.viewProfile(currentUserId, $scope);
            getClickedComic = function (id) {
                viewingId = id;
                console.log(viewingId);
                console.log(id);
                window.location.replace('/#/comic');
            };
            User.getSubscriptions()
                .success(function (data) {
                $scope.authors = data;
                console.log(data);
            });
        }
        profileController.prototype.editProfile = function () {
            console.log('hello');
            window.location.replace('/#/edit');
        };
        profileController.prototype.viewProfile = function (id, $scope) {
            var u = this.User;
            var c = this.Comic;
            $scope.comicsObjects = [];
            this.User.view(id)
                .success(function (data) {
                c.getsSavedComics().success(function (data) {
                    var everything = data;
                    for (var j = 0; j < everything.length; j++) {
                        c.viewComic(everything[j]).success(function (data2) {
                            if (id == data2.author) {
                            }
                        });
                    }
                });
                console.log(data.photo);
                $scope.uProfile = data;
                console.log(data);
                u.getFavourites(id).success(function (data) {
                    var arr = Object.keys(data).map(function (key) { return data[key]; });
                    var faveDiv = document.getElementById("faveContainer");
                    for (var i = 0; i < arr.length; i++) {
                        c.viewComic(arr[i]).success(function (data) {
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
        };
        profileController.prototype.createComic = function () {
            this.Comic.newComic()
                .success(function (data) {
                comicId = data;
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
            form.image = comicImg;
            console.log(form);
            this.Comic.makeComic(form)
                .success(function () {
                viewingId = comicId;
                window.location.replace('/#/comic');
            });
        };
        createController.prototype.save = function (form) {
            var comicImg = this.canvas.toJSON();
            console.log(comicImg);
            form.image = comicImg;
            this.Comic.saveComic(form)
                .success(function () {
                viewingId = comicId;
                window.location.replace('/#/profile');
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
                    //canvas1.setActiveObject(oImg);
                });
            };
            reader.readAsDataURL(Image);
        };
        createController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return createController;
    }());
    var comicController = (function () {
        function comicController($scope, User, Page, Comic) {
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
        comicController.prototype.view = function (id, $scope, callback) {
            console.log('viewComic');
            this.Comic.viewComic(id)
                .success(function (data) {
                $scope.comicData = data;
                callback();
            });
        };
        comicController.prototype.isFavourite = function (cid, $scope, callback) {
            console.log("viewing id");
            var flag = false;
            var favourites;
            this.User.getFavourites(currentUserId)
                .success(function (data) {
                favourites = Object.keys(data).map(function (key) { return data[key]; });
                for (var i = 0; i < favourites.length; i++) {
                    if (favourites[i] == cid) {
                        flag = true;
                    }
                    if (flag) {
                        document.getElementById("on").style.display = 'none';
                        document.getElementById("off").style.display = 'block';
                    }
                    else {
                        document.getElementById("on").style.display = 'block';
                        document.getElementById("off").style.display = 'none';
                    }
                    callback();
                }
            });
        };
        comicController.prototype.addFavourite = function () {
            var comicJson = { id: viewingId };
            console.log(comicJson);
            this.User.addFavourite(currentUserId, comicJson)
                .error(function (error) {
                console.log(error);
            });
            window.location.replace('/#/profile');
        };
        comicController.prototype.subscribe = function (id, $scope) {
            console.log(id);
            this.User.subscribe(id)
                .success(function (data) {
                alert("You have successfully subscribed to the author of this comic");
            });
        };
        comicController.prototype.addComment = function (comment) {
            var commentText = comment.text;
            var commentAuthorId = currentUserId;
            var commentObject = { author: commentAuthorId, text: commentText };
            console.log(commentObject);
            this.Comic.addComment(viewingId, commentObject)
                .success(function (error) {
                console.log(error);
            });
        };
        comicController.prototype.getComments = function (id, user, $scope) {
            var allComments = [];
            console.log("asdfasd");
            this.Comic.getComments(id)
                .success(function (d) {
                var j = 0;
                for (var i = 0; i < d.length; i++) {
                    var authId = d[i].author;
                    user.view(authId)
                        .success(function (data) {
                        var commentText = d[j].text;
                        var name = data.username;
                        var photo = data.photo;
                        var commentObj = { auth: name, comm: commentText, photo: photo };
                        allComments[j] = commentObj;
                        j++;
                    });
                }
                $scope.allComments = allComments;
            });
        };
        comicController.$inject = ['$scope', 'userService', 'pageService', 'comicService'];
        return comicController;
    }());
    var searchController = (function () {
        function searchController($scope, Page, Comic, Search) {
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
                .success(function (data) {
                $scope.allComics = JSON.parse(JSON.stringify(data));
            });
            $scope.sentHTTP = function (content) {
                //payload creation, HTTP request, etc;
            };
            //  c.viewComic(arr[i]).success(function(data) 
        }
        searchController.prototype.passToGetComic = function (form, $scope) {
            console.log(form);
            this.Comic.viewComic(form)
                .success(function (data) {
                //console.log(data);  
                viewingId = data.id;
                window.location.replace('/#/comic');
            });
        };
        searchController.$inject = ['$scope', 'pageService', 'comicService', 'searchService'];
        return searchController;
    }());
    var searchService = (function () {
        function searchService($http) {
            this.$http = $http;
        }
        searchService.prototype.searchAllComics = function (search) {
            return this.$http.get('/comic/search/' + search);
        };
        searchService.prototype.getComics = function () {
            return this.$http.get('comic/search');
        };
        searchService.$inject = ['$http'];
        return searchService;
    }());
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
        comicService.prototype.addComment = function (comicId, comment) {
            return this.$http.post('/comic/addComment/' + comicId, comment);
        };
        comicService.prototype.getComments = function (comicId) {
            return this.$http.get('/comic/getComments/' + comicId);
        };
        comicService.prototype.getsSavedComics = function () {
            return this.$http.get('/comic/saved');
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
        userService.prototype.edit = function (id, userData) {
            return this.$http.put('/user/edit/' + id, userData);
        };
        userService.prototype.login = function (user) {
            return this.$http.put('/user/login', user);
        };
        userService.prototype.logout = function () {
            return this.$http.get('/user/logout');
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
        userService.prototype.subscribe = function (id) {
            console.log('subscribed to: ' + id);
            return this.$http.post('/user/subscribe/' + id);
        };
        userService.prototype.getSubscriptions = function () {
            return this.$http.get('/user/subscriptions/');
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
        .controller('comicController', comicController)
        .controller('searchController', searchController)
        .controller('editController', editController)
        .service('searchService', searchService)
        .service('userService', userService)
        .service('pageService', pageService)
        .service('comicService', comicService)
        .config(routes);
})(comicSans || (comicSans = {}));
//# sourceMappingURL=core.js.map
