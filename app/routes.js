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
    author: String,
    username: String,
    collaborators: [{ uid: String, username: String }],
    synopsis: String,
    tags: [String],
    comments: [{author: String, text: String }],
    date: { type: Date, default: Date.now },
    hidden: Boolean
});

var ComicSans = db.model('comic-sans', schema); //model
var gUID;
var gUName;
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
    }, function(error, authData) {
        if (error) {
            console.log("log in failed " + error);
            return res.send(error);
        } else {
            gUID = authData.uid;
            console.log("log in succeeded" + authData);
            return res.send(gUID);             //return the userID to client for easy access to personal page
        }

    }, { remember: "sessionally" });

}


function logout(req, res) {
    // Let's assume this Firebase reference is already authenticated
    var userDB = refRoot;
    var userID = gUID;
    // Unauthenticate the client
    userDB.unauth();
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
                    "photo" : req.body.photo
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
        
        var getUName = uUserDB.child("username");
        getUName.once('value', function(snapshot) {
            console.log("Username: " + snapshot.val());
            gUName = snapshot.val();
        }, function(err) {
         console.log("Can't find username");
        });


        console.log(req.body);
        uUserDB.once('value', function(snapshot) {
            var data = snapshot.val();
            return res.json(data);
        }, function(error) {
            return res.send(error);
        });
    });


    app.get('/user/getFavourite/:uid', function(req, res) {
        var userId = req.params.uid;
        var userDB = refRoot.child('users/' + userId + '/favourites');
        userDB.once('value', function(snapshot) {
            var data = snapshot.val();
            return res.json(data);
        }, function(error) {
            return res.send(error);
        });
    });

    app.put('/user/edit/:uid', function(req, res) {
        var userID = req.params.uid;
        var userDB = refRoot.child('users/' + userID);

        userDB.update({
            "preferences": req.body.preferences,
            "username": req.body.name,
            "editor": req.body.editor
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
        fave.set(req.body.id, function (error){
            if(error) {
                console.log("failed to create user");
                return res.send(error);
            } else {
                console.log("user updated");
                return res.send(true);
            }
        });
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
        //var length = jsontags.length;
        var arrayoftags = [];
        var arrayofComments = [];

        //console.log("Length of jsonarray="+length);
        if (jsontags != null) {
            for (i = 0; i < jsontags.length; i++) {
                var tag = jsontags[i];
                arrayoftags.push(tag.text);
            }
        }
        // console.log("Array of tags in string!: " + tagarray);

        Comic.create({
            "image": {},
            "id": comicID,
            "title": req.body.title,
            "author": gUID,
            "username": gUName,
            "collaborators": req.body.collabs,
            "synopsis": req.body.synopsis,
            "tags": arrayoftags,
            "comments": [],
            "hidden" : req.body.hidden
        }, function (err, comic) {
            if (err)
                res.send(err);
            else {
                console.log("comic " + req.body.title + " added");
                res.redirect('/home');
            }
        });
        //console.log(Comic);



      var comicProperties = ({
        "image": req.body.image,
        "id": comicID,
        "title": req.body.title,
        "author": gUID,
        "username": gUName,
        "collaborators": req.body.collabs,
        "synopsis": req.body.synopsis,
        "tags": arrayoftags,
        "comments": [],
        "hidden" : req.body.hidden
      });

      //console.log(comicProperties);

        var comicToSave = new ComicSans(comicProperties);
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
        var arrayoftags = [];
        var arrayofComments = [];
        //console.log("Length of jsonarray="+length);
        if (json.tags != null) {
            for (i = 0; i < jsontags.length; i++) {
                var tag = jsontags[i];
                arrayoftags.push(tag.text);
            }
        }
        // console.log("Array of tags in string!: " + tagarray);

        var comicProperties = ({
            "image": {},
            "id": comicID,
            "title": req.body.title,
            "author": gUID,
            "username": gUName,
            "collaborators": req.body.collabs,
            "synopsis": req.body.synopsis,
            "tags": arrayoftags,
            "comments": [],
            "hidden" : req.body.hidden
        });


        var comicToSave = new saveComicSans(comicProperties);
        comicToSave.save(function(err) {
            if (err) return handleError(err);

            console.log(comicToSave);
        });



         console.log(comicToSave);
      });

    app.post('/user/subscribe/:subscribeid', function(req, res) {
      var subscribeUID = req.params.subscribeid;
      
      console.log('subscribe to: ' + subscribeUID);
      var userDB = refRoot.child('users/' + gUID + '/subscriptions');
      console.log("userDB for subscribe: " + userDB);
      userDB.push(subscribeUID, function(error, data) {
         if (error) {
            console.log(error);
         } else {
            console.log('subscribed');
            return res.send(data);
         }
       });
    });

    app.get('/user/subscriptions', function(req, res) {
        var userDB = refRoot;
        console.log(userDB);
        
    });

    app.post('/comic/addComment/:comicID', function(req, res){
        var comicID = req.params.comicID;
        var comic;
        var arr = [];

        ComicSans.findOne({ "id": comicID }, function(err, Comic) {
            if (err) {
                console.log(err);
            } else {
                console.log(req.body);
                ComicSans.findByIdAndUpdate(
                    Comic._id,
                    {$push: {"comments": { $each:  [{ author: req.body.author, text: req.body.text }]}}},
                    {safe: true, upsert: true},
                    function(err, id) {
                        if(err){
                            console.log(err);
                        } else {
                            console.log(id);
                            res.json(id);
                        }
                    }
                );
            }
        });




    });


    app.get('/comic/getComments/:comicID', function(req, res){
        var comicID = req.params.comicID;
        ComicSans.findOne({ "id": comicID }, function(err, Comic) {
            if (err) {
                console.log(err);
            } else {
                console.log(Comic);
                res.send(Comic.comments);
            }
        });
    });

    /* GET Comic View Page */
    app.get('/comic/view/:comicID', function(req, res) {
        var comicID = req.params.comicID;

        ComicSans.findOne({ "id": comicID}, function(err, Comic) {
            if (err) {
                console.log(err);
            } else {
                res.json(Comic);
            }
        });
    });

    /* GET Search Page*/ /*
    app.get('/new/search/', function(req, res ){
        var searchTerm = req.body.searchTerm;
        console.log(searchTerm)
        res.send(searchTerm);
    });

*/
    /* Get all Searched Comics Page*/
    /*app.get('/comic/search/:word', function(req, res) {
      var tag = req.params.word;
      console.log("Searchbar keyword submit: " + tag);
      //var found = ComicSans.findOne({ tag : 'asd'});
      var collection = db.collection('comic-sans');
      //console.log(collection);
      var searchedInArray;
      var arrayTitles=[];
      collection.find({tags:tag}).toArray(function(err, results) {
         //console.log(results);
         searchedInArray=results;
         console.log(searchedInArray);
         console.log("Length of search= " + searchedInArray.length);
         for (i=0; i<searchedInArray.length;i++) {
            var title = searchedInArray[i];
            arrayTitles.push(title.title);

         }
         console.log(arrayTitles);
         res.json(arrayTitles);
         
      });
      
   });*/

   app.get('/comic/search', function(req,res) {
      var collection = db.collection('comic-sans');
      collection.find().toArray(function(err, results) {
         if (err) {
            console.log(err);
         } else {
         }
         res.send(results);

      });

    });


    //// application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};