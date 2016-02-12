///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
    ///<reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

import Comic = require('./models/comic.js');
import Firebase = require('firebase');
import database = require('../config/database.js');
var refRoot = new Firebase(database.firebase);
var fs = require('fs');


function login(req, res) {

    let userDB = refRoot;
    var userID;

    userDB.authWithPassword({
        "email"    : req.body.email, 
        "password" : req.body.password
    }, function(err, authData) {
        if (err) {
            console.log("log in failed" + err);
            res.send(err);
        } else {
            let userID = authData.uid;
            console.log("log in scucess" + authData);
            res.send(userID);
        }

    }, { remember    : "sessionally" });

}



class App {
    constructor() { }
    encapsulation() {
    

        var express = require('express');
        var app = express.App();

        /* POST to createuser page. */
        app.post('/user/createuser', function(req, res) {
            var userDB = refRoot;
            var uUniqueDB;

            userDB.createUser({
                "email"     : req.body.email,
                "password"  : req.body.password
            }, function(err, userData) {
                if (err) {
                    console.log("failed to create user");
                } else {
                    console.log("created a new user " + userData.uid);
                    uUniqueDB = userDB.child('users/' + userData.uid);
                    uUniqueDB.set({
                        "preferences"   : req.body.preferences,
                        "username"      : req.body.name,
                        "editor"        : req.body.editor
                    });
                    login(req, res)
                }

            });
        });


        /* PUT userID and authenticating the client. */
        app.put('/user/login', function (req, res) {
            //login user helper function above to firebase
            login(req, res);
        });

        /* GET user's personal profile. */
        app.get('user/profile/:uid', function (req, res) {
            var userID = req.params.uid;
            console.log(userID);
            var userDB = refRoot.child('users/');
            var uUserDB = userDB.child(userID);
            console.log(req.body);
            uUserDB.on('value', function(snapshot) {
                var data = snapshot.val();
                res.json(data);
            }, function (err)  {
                res.send(err);
            });
        });

     // view+create comics -------------------------------------------------------------
    /* GET New Comic Page. */
    app.get('/comic/newcomic', function (req, res) {
        var comicID;
        res.send(comicID);
    });    
    /* POST to Create Comic Service. */
    app.post('/comic/createcomic', function (req, res, authData) {
        var comicID = req.path;
        var userID = authData.uid;
        

        Comic.create({
            "image": {},
            "id": comicID,
            "author": {"uid": userID, "username" : username},
            "title": req.body.title,
            "collaborators": req.body.collabs,
            "synopsis": req.body.about,
            "hidden" : req.body.hidden
        }, function (err, comic) {
            if (err)
                res.send(err);
            else {
                console.log("comic " + req.body.title + " added");
                res.redirect('/home');
            }
        });


    });

    /* GET Comic View Page */
    app.get('/comic/view/:comicID', function (req, res) {
        var comicID = req.params.comicID;
        
        Comic.findOne({"id": comicID}, function(err, Comic) { 
          if (err) {
            console.log(err);
          } else {
            res.json(Comic);
            console.log(found.comicID);
          }
        });
    });

 // application -----------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    module.exports = app;
    }
} 
var app = new App();
app.encapsulation();