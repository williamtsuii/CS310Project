var Todo = require('./models/todo');

function getTodos(res){
	Todo.find(function(err, todos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(todos); // return all todos in JSON format
		});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', function(req, res) {

		// use mongoose to get all todos in the database
		getTodos(res);
	});
    
    //create a new user in the user database
    app.post('/user/createuser', function(req, res) {
        
        var userDB = req.db;        
        var userID;
        
        userDB.createUser({
            email: req.body.email,       //need to be changed for oo and depending on html
            password: req.body.password  //same as above
        }, function(error, userData) {
            if (error) {
                console.log("failed to create user");
            } else {
                userID = userData.id;
                console.log("created a new user " + userData.id);
            }
        });
        
        var uUniqueDB = userDB.child('data/users/' + userID);
        uUniqueDB.set({
           name: "",                    //again changed for oo and depending on html
           gender: "",          
           birthday: "" 
        });
    });
    
    //get back userID and authenticating the client
    app.get('/user/login', function(req, res) {
       
       var userDB = req.db;
       var userID;
       
       userDB.authWithPassword({
           
          email :  req.body.email,          //need to be changed for oo and depending on the html
          password : req.body.password      //same as above
          
       }, function(error, authData) {
           
           if (error) {
               console.log("log in failed " + error);
               res.send(error);
           } else {
              userID = authData.uid;
              console.log("log in succeeded" + authData);
              res.send(userID);             //return the userID to client for easy access to personal page
           }
           
       }, {remember: "sessionally"});
    });
        
	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			getTodos(res);
		});

	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			getTodos(res);
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};