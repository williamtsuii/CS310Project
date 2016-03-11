var Comic = require('./models/comic');
database = require('../config/database.js');
var Firebase = require('firebase');
var refRoot = new Firebase(database.firebase);
//var comicDB = new Comic(database.url);
var fs = require('fs');

//03/09/2016
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://william1:asdfjkl1@ds011409.mlab.com:11409/comicsans');
var schema = new mongoose.Schema({
    image: String,
    id: String,
    title: String,
    author: { uid: String, username: String },
    collaborators: [{ uid: String, username: String }],
    synopsis: String,
    tags: [String],
    comments: [{ body: String, date: Date, user: String }],
    date: { type: Date, default: Date.now },
    hidden: Boolean
});

var schemaSave = new mongoose.Schema({
    image: { data: Object },
    id: String,
    title: String,
    author: { uid: String, username: String },
    collaborators: [{ uid: String, username: String }],
    synopsis: String,
    tags: [String],
    comments: [{ body: String, date: Date, user: String }],
    date: { type: Date, default: Date.now },
    hidden: Boolean
});
var ComicSans = mongoose.model('comic-sans', schema); 
//var saveComicSans = mongoose.model('comic-sans', schema); //model


function login(req, res) {

    var userDB = refRoot;
    var userID;

    userDB.authWithPassword({
        "email": req.body.email,          //need to be changed for oo and depending on the html
        "password": req.body.password          //same as above
    }, function(error, authData) {
        if (error) {
            console.log("log in failed " + error);
            return res.send(error);
        } else {
            userID = authData.uid;
            console.log("log in succeeded" + authData);
            return res.send(userID);             //return the userID to client for easy access to personal page
        }

    }, { remember: "sessionally" });

}

var doIt = function(req, res){
    return function (error){
        if(error) {
            console.log("failed to create user");
            return res.send(error);
        } else {
            console.log("user updated");
            return res.send(true);
        }
    }
}


module.exports = function (app) {

    // api ---------------------------------------------------------------------
    //create a new user in the user database
    app.post('/user/createuser', function(req, res) {
        var userDB = refRoot;
        var uUniqueDB;

        userDB.createUser({
            "email": req.body.email,       //need to be changed for oo and depending on html
            "password": req.body.password  //same as above
        }, function(error, userData) {
            if (error) {
                console.log("failed to create user");
            } else {
                console.log("created a new user " + userData.uid);
                uUniqueDB = userDB.child('users/' + userData.uid);
                uUniqueDB.set({
                    "preferences": req.body.preferences,
                    "username": req.body.name,
                    "editor": req.body.editor,
                    "favourites": 'hello'
                });
                login(req, res);
            }
        });
    });

    //get back userID and authenticating the client
    app.put('/user/login', function(req, res) {
        //login using the helper function to firebase
        login(req, res);
    });

    app.get('/user/profile/:uid', function(req, res) {
        var userID = req.params.uid;
        console.log(userID);
        var userDB = refRoot.child('users/');
        var uUserDB = userDB.child(userID);
        console.log(req.body);
        uUserDB.on('value', function(snapshot) {
            var data = snapshot.val();
            return res.json(data);
        }, function(error) {
            return res.send(error);
        });
    });


    app.get('/user/getFavourite/:uid', function(req, res) {
        var userId = req.params.uid;
        var userDB = refRoot.child('users/' + userId + '/favourites');
        userDB.on('value', function(snapshot) {
            var data = snapshot.val();
            return res.json(data);
        }, function(error) {
            return res.send(error);
        });
    });

    app.put('/user/edit/*', function(req, res) {
        var userID = req.path;
        var userDB = refRoot.child('users/' + userID);

        userDB.set({
        }, function(error) {
            if (error) {
                console.log("failed to create user");
                return res.send(error);
            } else {
                console.log("user updated");
                return res.send(true);
            }
        })
    });

    app.post('/user/favourites/:uid', function(req, res) {
        var userId = req.params.uid;

        var userDB =refRoot.child('users/' + userId + '/favourites');
        var fave = userDB.push();
        fave.set(req.body.id, doIt());
    });



    // view+create comics -------------------------------------------------------------
    /* GET New Comic Page. */
    app.get('/comic/newcomic', function(req, res) {
        var comicID = 'id-' + Math.random().toString(36).substr(2, 16);
        res.send(comicID);
    });

    /* POST to Create Comic Service. */
    app.post('/comic/createcomic/:comicId', function(req, res, authData) {
        var comicID = req.params.comicId;
        var userID = authData.uid;
        var username = authData.username;
        // pushing tags into an array of strings
        var jsontags = req.body.tags;
        var length = jsontags.length;
        var arrayoftags = [];
        //console.log("Length of jsonarray="+length);
        for (i = 0; i < jsontags.length; i++) {
            var tag = jsontags[i];
            arrayoftags.push(tag.text);
        }
        // console.log("Array of tags in string!: " + tagarray);


        Comic.create({
            "image": {},
            "id": comicID,
            "author": {"uid": userID, "username" : username},
            "title": req.body.title,
            "collaborators": req.body.collabs,
            "synopsis": req.body.about,
            "tags": arrayoftags,
            "hidden" : req.body.hidden
        }, function (err, comic) {
            if (err)
                res.send(err);
            else {
                console.log("comic " + req.body.title + " added");
                res.redirect('/home');
            }
        });
        console.log(Comic);


      var comicProperties = ({
         "image": req.body.image,
         "id": comicID,
         "author": {"uid": userID, "username" : username},
         "title": req.body.title,
         "collaborators": req.body.collabs,
         "synopsis": req.body.about,
         "tags": arrayoftags,
         "hidden" : req.body.hidden
      });

        var comicToSave = new ComicSans(comicProperties);
        console.log(comicProperties.image);
        comicToSave.save(function(err) {
            if (err) return handleError(err);

            console.log(comicToSave);
        });

    });

    app.post('/comic/savecomic/:comicId', function(req, res, authData) {
        var comicID = req.params.comicId;
        var userID = authData.uid;
        var username = authData.username;
        // pushing tags into an array of strings
        var jsontags = req.body.tags;
        var length = jsontags.length;
        var arrayoftags = [];
        //console.log("Length of jsonarray="+length);
        for (i = 0; i < jsontags.length; i++) {
            var tag = jsontags[i];
            arrayoftags.push(tag.text);
        }
        // console.log("Array of tags in string!: " + tagarray);

        var comicProperties = ({
            "image": req.body.data,
            "id": comicID,
            "author": { "uid": userID, "username": username },
            "title": req.body.title,
            "collaborators": req.body.collabs,
            "synopsis": req.body.about,
            "tags": arrayoftags,
            "hidden": req.body.hidden
        });


        var comicToSave = new saveComicSans(comicProperties);
        comicToSave.save(function(err) {
            if (err) return handleError(err);

            console.log(comicToSave);
        });



    });

    /* GET Comic View Page */
    app.get('/comic/view/:comicID', function(req, res) {
        var comicID = req.params.comicID;

        ComicSans.findOne({ "id": comicID }, function(err, Comic) {
            if (err) {
                console.log(err);
            } else {
                res.json(Comic);
            }
        });
    });

    /* GET Search Tag Page*/
    app.get('/comic/search/', function(req, res) {
        var searchTerm = req.body.searchterm;
        res.send(searchTerm);
    });
    /* POST Search Tag Page*/
    app.post('comic/search/:searchTerm', function(req, res) {
        var tag = req.params.searchTerm;
        console.log("Finding all mongo docs:" + ComicSans.find());

    });


    //app.upload('comic/upload', function (req, res, authData) {
    //    var comicID = req.path;
    //    var userID = authData.uid;
    //
    //    Comic.upload({
    //
    //    }, function () {
    //
    //    });
    //
    //});


    //// application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
