///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path="../types/DefinitelyTyped/express/express.d.ts"/>
var Router = (function () {
    function Router() {
    }
    Router.prototype.start = function () {
        var express = require('express');
        var router = express.Router();
        var firebase = require('firebase');
        var rootref = new firebase('https://cs310.firebase.com');
        /* GET home page. */
        router.get('/', function (req, res, next) {
            res.render('index', { title: 'Express' });
        });
        /* PUT user to database */
        router.get('/adduser', function (req, res) {
            //set up variables needed for funtions
            var userDB = rootref;
            var user = new User(req.body.email, req.body.password);
            var userID;
            //add the user by using the firebase api
            userDB.createUser({
                email: user.getEmail(),
                password: user.getPassword()
            }, function (error, userData) {
                if (error) {
                    console.log("failed to make user lah");
                }
                else {
                    userID = userData.id;
                    console.log("created new user" + userData.id);
                }
            });
            //because creating user doesnt add any other data but hotmail and password. go to database, create a user database that has everything we needed
            //for the rest of it
            var uUniqueDB = userDB.child('users/' + userID);
            uUniqueDB.set({});
        });
        module.exports = router;
    };
    return Router;
})();
var User = (function () {
    function User(email, password) {
        this.password = name;
        this.email = email;
    }
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.getEmail = function () {
        return this.email;
    };
    return User;
})();
var router = new Router();
router.start();
