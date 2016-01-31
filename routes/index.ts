///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path="../types/DefinitelyTyped/express/express.d.ts"/>

class Router {
    constructor() {
    } start() {
        var express = require('express');
        var router = express.Router();
        var firebase = require('firebase');
        var rootref = new firebase('https://cs310.firebase.com');
        
        /* GET home page. */
        router.get('/', function(req, res, next) {
            res.render('index', { title: 'Express' });
        });
        
        /* PUT user to database */
        router.get('/adduser', function(req, res) {
            //set up variables needed for funtions
            var userDB = rootref;
            var user = new User(req.body.email, req.body.password);
            var userID;
            //add the user by using the firebase api
            userDB.createUser({
                email: user.getEmail(),
                password: user.getPassword()
            }, function(error, userData) {
                if (error){
                    console.log("failed to make user lah");
                } else {
                    userID = userData.id
                    console.log("created new user" + userData.id);
                }
            });
            //because creating user doesnt add any other data but hotmail and password. go to database, create a user database that has everything we needed
            //for the rest of it
            var uUniqueDB = userDB.child('users/'+ userID);
            uUniqueDB.set({
                //add stuff when we have the idea of what there is 
                
            });
        });
        
        router.get('/view', function(req, res) {
            //add function to grab images dependingongiven link for viewing
        });

        module.exports = router;
    }
}

interface UserInterface {
    
    getEmail(): string;
    getPassword(): string; 
       
}

class User implements UserInterface {
    
    private password : string;
    private email : string;
    
    constructor(email : string, password : string) {
        this.password = name;
        this.email = email;
    }
    
    getPassword() {
        return this.password;
    }
    
    getEmail() { 
        return this.email;
    }
    
}

var router = new Router();
router.start();