angular.module('scotchTodo', ['userService', 'pageService', 'ngRoute', 'common.fabric',
    'common.fabric.utilities',
    'common.fabric.constants'
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/signup', { templateUrl: 'signup.html', controller: 'signupController as signUp' })
            .when('/home', { templateUrl: 'home.html', controller: 'homeController as home' })

            .when('/profile', { templateUrl: 'profile.html', controller: 'profileController as profile' })

            .when('/create', { templateUrl: 'createComic.html', controller: 'comicCtrl', })
            .otherwise({ redirectTo: '/home' });
    }])

    .controller('comicCtrl', ['$scope', 'Fabric', 'FabricConstants', 'Keypress', function ($scope, Fabric, FabricConstants, Keypress) {
        console.log($scope);
        $scope.fabric = {};
        $scope.FabricConstants = FabricConstants;

        //
        // Creating Canvas Objects
        // ================================================================
        $scope.addShape = function (path) {
            $scope.fabric.addShape('http://fabricjs.com/assets/15.svg');
        };

        $scope.addImage = function (image) {
            $scope.fabric.addImage('http://stargate-sg1-solutions.com/blog/wp-content/uploads/2007/08/daniel-season-nine.jpg');
        };

        $scope.addImageUpload = function (data) {
            var obj = angular.fromJson(data);
            $scope.addImage(obj.filename);
        };

        //
        // Editing Canvas Size
        // ================================================================
        $scope.selectCanvas = function () {
            $scope.canvasCopy = {
                width: $scope.fabric.canvasOriginalWidth,
                height: $scope.fabric.canvasOriginalHeight
            };
        };

        $scope.setCanvasSize = function () {
            $scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
            $scope.fabric.setDirty(true);
            delete $scope.canvasCopy;
        };

        //
        // Init
        // ================================================================
        $scope.init = function () {
            $scope.fabric = new Fabric({
                JSONExportProperties: FabricConstants.JSONExportProperties,
                textDefaults: FabricConstants.textDefaults,
                shapeDefaults: FabricConstants.shapeDefaults,
                json: {}
            });
        };

        $scope.$on('canvas:created', $scope.init);

        Keypress.onSave(function () {
            $scope.updatePage();
        });

    }]);

var id;
var u;

function MainCtrl($scope, Page, User) {
    var main = this;
    console.log('MainCtrl loaded!');
    $scope.Page = Page;
    $scope.User = User;

}


function signupController($scope, User, Page) {
    var signUp = this;
    Page.setTitle('Sign Up');
    $scope.formData = {};
    $scope.signupUser = function () {
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if (signUp.formData.email != undefined) {
            User.signup(signUp.formData)
                .success(function (data) {
                    id = data;
                    window.location.replace('/#/profile');

                });
        }
    };
}


function profileController($scope, User, Page) {
    var profile = this;
    console.log(id);
    Page.setTitle('Profile');
    User.view(id)
        .success(function (data) {
            profile.user = data;
            console.log(profile.user.preferences);
        });
    $scope.createComic = function () {
        window.location.replace('/#/create');
    }
}

/*
function createController($scope, User, Page, $www, Modal, Fabric, FabricConstants, ImagesConstants, Keypress) {
    Page.setTitle("New Comic");
    $scope.fabric = {};
    $scope.ImagesConstants = ImagesConstants;
    $scope.FabricConstants = FabricConstants;   

    //
    // Creating Canvas Objects
    // ================================================================
    $scope.addShape = function (path) {
        $scope.fabric.addShape('/lib/svg/' + path + '.svg');
        Modal.close();
    };

    $scope.addImage = function (image) {
        $scope.fabric.addImage('/image?image=' + image + '&size=full');
        Modal.close();
    };

    $scope.addImageUpload = function (data) {
        var obj = angular.fromJson(data);
        $scope.addImage(obj.filename);
        Modal.close();
    };

    //
    // Editing Canvas Size
    // ================================================================
    $scope.selectCanvas = function () {
        $scope.canvasCopy = {
            width: $scope.fabric.canvasOriginalWidth,
            height: $scope.fabric.canvasOriginalHeight
        };
    };

    $scope.setCanvasSize = function () {
        $scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
        $scope.fabric.setDirty(true);
        Modal.close();
        delete $scope.canvasCopy;
    };

    $scope.updateCanvas = function () {
        var json = $scope.fabric.getJSON();

        $www.put('/api/canvas/' + $scope.canvasId, {
            json: json
        }).success(function () {
            $scope.fabric.setDirty(false);
        });
    };

    //
    // Init
    // ================================================================
    $scope.init = function () {
        $scope.fabric = new Fabric({
            JSONExportProperties: FabricConstants.JSONExportProperties,
            textDefaults: FabricConstants.textDefaults,
            shapeDefaults: FabricConstants.shapeDefaults,
            json: $scope.main.selectedPage.json
        });
    };

    $scope.$on('canvas:created', $scope.init);

    Keypress.onSave(function () {
        $scope.updatePage();
    });
    
    /*$scope.createComic = function() {
        console.log($scope.formData);
        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        Comic.create($scope.formData)
            .success(function(data) {
                window.location.replace('/#/home');
                //$scope.formData = {}; // clear the form so our user is ready to enter another

                });
        }
        
}
*/


function homeController($scope, User, Page) {
    var home = this;
    Page.setTitle('Home');
    $scope.loginUser = function () {
        console.log(home.user.email);
        User.login(home.user)
            .success(function (data) {
                u = home.user;
                console.log(u);
                id = data;
                home.user = {};
                window.location.replace('/#/profile');
            });
    }

}


angular.module('example', [
    'common.fabric',
    'common.fabric.utilities',
    'common.fabric.constants'
])

    .controller('ExampleCtrl', ['$scope', 'Fabric', 'FabricConstants', 'Keypress', function ($scope, Fabric, FabricConstants, Keypress) {

        $scope.fabric = {};
        $scope.FabricConstants = FabricConstants;

        //
        // Creating Canvas Objects
        // ================================================================
        $scope.addShape = function (path) {
            $scope.fabric.addShape('http://fabricjs.com/assets/15.svg');
        };

        $scope.addImage = function (image) {
            $scope.fabric.addImage('http://stargate-sg1-solutions.com/blog/wp-content/uploads/2007/08/daniel-season-nine.jpg');
        };

        $scope.addImageUpload = function (data) {
            var obj = angular.fromJson(data);
            $scope.addImage(obj.filename);
        };

        //
        // Editing Canvas Size
        // ================================================================
        $scope.selectCanvas = function () {
            $scope.canvasCopy = {
                width: $scope.fabric.canvasOriginalWidth,
                height: $scope.fabric.canvasOriginalHeight
            };
        };

        $scope.setCanvasSize = function () {
            $scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
            $scope.fabric.setDirty(true);
            delete $scope.canvasCopy;
        };

        //
        // Init
        // ================================================================
        $scope.init = function () {
            $scope.fabric = new Fabric({
                JSONExportProperties: FabricConstants.JSONExportProperties,
                textDefaults: FabricConstants.textDefaults,
                shapeDefaults: FabricConstants.shapeDefaults,
                json: {}
            });
        };

        $scope.$on('canvas:created', $scope.init);

        Keypress.onSave(function () {
            $scope.updatePage();
        });

    }]);