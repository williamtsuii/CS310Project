var Comic = require('./models/comic');
var database = require('C:/Users/willi/Documents/CS310 Project/Comic-Sans/config/database.js');
var Firebase = require('firebase');
var refRoot = new Firebase(database.firebase);
var comicDB = new Comic(database.url);


/*
function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
};
*/
function login(req, res) {

    var userDB = refRoot;
    var userID;

    userDB.authWithPassword({
        "email": req.body.email,          //need to be changed for oo and depending on the html
        "password": req.body.password          //same as above
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
    //create a new user in the user database
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
                    "preferences": req.body.preferences,
                    "username": req.body.name,
                    "editor": req.body.editor
                });
                login(req, res);
            }
        });
    });
    
    //get back userID and authenticating the client
    app.put('/user/login', function (req, res) {
        //login u+ng the helper function to firebase
        login(req, res);
    });

    app.get('/user/profile/*', function (req, res) {
        var userID = req.path;
        var userDB = refRoot.child('users/' + userID);
        console.log(req.body);
        userDB.on('value', function (snapshot) {
            var data = snapshot.val();
            res.json(data);
        }, function (error) {
            res.send(error);
        });
    });
    
    app.put('user/edit/*', function(req, res) {
        var userID = req.path;
        var userDB =refRoot.child('users/' + userID);
        
        userDB.set({
        }, function(error){
            if(error) { 
                console.log("failed to create user");
                res.send(error);
            } else {
                console.log("user updated");
                res.send(true);
            }
        })
    });
    

     // view+create comics -------------------------------------------------------------
    /* GET New Comic Page. */
    app.get('/comic/newcomic', function (req, res) {
        var comicID;
        res.send(comicID);
    });    
    /* POST to Create Comic Service. */
    app.post('/comic/createcomic', function (req, res, authData) {
        var db = comicDB;
        var comicID = req.path;
        var userID = authData.uid;

        comicDB.insert({
            "id": comicID,
            "author": userID,
            "title": req.body.title,
            "synopsis": req.body.about
        }, function (err, comic) {
            if (err)
                res.send(err);
            else {
                console.log("created new comic");
                res.redirect('/home');
            }
        });


    });

    /* GET Comic View Page */
    app.get('/comic/view/*', function (req, res) {
        var comicID = req.path;
        var db = comicDB.child('comics/' + comicID);
        db.once('value', function (snapshot) {
            var data = snapshot.val();
            res.json(data);
        }, function (error) {
            res.send(error);
        });
    });




    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
