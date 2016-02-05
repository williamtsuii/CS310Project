var Todo = require('./models/todo');
var database = require("c:/users/alex/onedrive/2015w2/cs310/comic-sans/config/database")
var Firebase = require('firebase');
var refRoot = new Firebase(database.firebase);

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
};

function login(req, res) {

    var userDB = refRoot;
    var userID;

    userDB.authWithPassword({

        "email": req.body.email,          //need to be changed for oo and depending on the html
        "password": req.body.password      //same as above
          
    }, function (error, authData) {
        if (error) {
            console.log("log in failed " + error);
            res.send(error);
        } else {
            userID = authData.uid;
            console.log("log in succeeded" + authData);
            res.send(userID);             //return the userID to client for easy access to personal page
        }

    }, { remember: "sessionally" });

}

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    
    //create a new user in the usezr database
    app.post('/user/createuser', function (req, res) {

        var userDB = refRoot;
        var uUniqueDB;

        userDB.createUser({
            "email": req.body.email,       //need to be changed for oo and depending on html
            "password": req.body.password  //same as above
        }, function (error, userData) {
            if (error) {
                console.log("failed to create user");
            } else {
                console.log("created a new user " + userData.uid);
                uUniqueDB = userDB.child('users/' + userData.uid);
                uUniqueDB.set({
                    "name": req.body.name,                    //again changed for oo and depending on html
                    "gender": req.body.gender,
                    "birthday": req.body.birthday,
                    "preferences": req.body.preferences
                });
            }
        });

        login(req, res);

    });
    
    //get back userID and authenticating the client
    app.get('/user/login', function (req, res) {
        
        //login using the helper function to firebase
        login(req, res);
    });

    app.get('/user/profile/*', function (req, res) {
        var userID = req.path;
        var userDB = refRoot.child('users/' + userID);

        userDB.once('value', function (snapshot) {
            var data = snapshot.val;
            res.json(data);
        }, function (error) {
            res.send(error);
        });
    });
    
    app.post('user/edit/*'), function(req, res) {
        var userID = req.path;
        var userDB =refRoot.child('users/' + userID);
        
        userDB.set({
            "name" : req.body.name,
            "gender": req.body.gender,
            "birthday": req.body.birthday,
            "preferences": req.body.preferences
        }, function(error){
            if(error) { 
                console.log("failed to create user");
                res.send(error);
            } else {
                console.log("user updated");
                res.send(true);
            }
        })
    }
    

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};