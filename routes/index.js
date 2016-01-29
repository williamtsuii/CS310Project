///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path="../types/DefinitelyTyped/express/express.d.ts"/>
var Router = (function () {
    function Router() {
    }
    Router.prototype.constructo = function () {
    };
    Router.prototype.start = function () {
        var express = require('express');
        var router = express.Router();
        var Firebase = require('firebase');
        var refRoot = new Firebase('https://cs310.firebase.com');
        /* GET home page. */
        router.get('/', function (req, res, next) {
            res.render('index', { title: 'Express' });
        });
        /*PUT users to userdb */
        router.get('/adduser', function (req, res) {
            //users are saved seperately, no need to go to database. firebase automatically adds it to their own database for only users.
            var users = refRoot;
            //cuz they ask us for object fucking orineted code. this just makes it slower
            var user = new User(req.body.email, req.body.password);
            var userID;
            //create new user using firebase api
            users.createUser({
                email: user.getEmail(),
                password: user.getPassword()
            }, function (error, userData) {
                if (error) {
                    console.log("Error creating User");
                }
                else {
                    userID = userData.id;
                    console.log("Succesful creating of user with it", userData.id);
                }
            });
            //in here, access data in firebase, make a node with email as the key and add other details needed so we can connect to the user: 
            //example: preference list, editor?, name, date of birth, etc
            var uUserDB = refRoot.child('users/' + userID);
            uUserDB.set({});
        });
        module.exports = router;
    };
    return Router;
})();
var User = (function () {
    function User(email, password) {
        this.email = email;
        this.password = password;
    }
    User.prototype.getEmail = function () {
        return this.email;
    };
    ;
    User.prototype.getPassword = function () {
        return this.password;
    };
    return User;
})();
var router = new Router();
router.start();
