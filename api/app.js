const express = require("express");
const app = express();

const mongoose = require("./db/mongoose");
const bodyParser = require("body-parser");

// load in the mongoose models
const { List, Task, User } = require("./db/models");

app.use(bodyParser.json());


//Cors HEADERS Middleware
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 /*  res.header(
      'Access-Control-Expose-Headers',
      'x-access-token, x-refresh-token'
  );
 */
  next();
});


// Verify refresh token middleware (which will be verifying the seession)
let verifySession = (req, res, next) =>{
  // grab the refresh token from the request header
  let refreshToken = req.header("x-refresh-token")

  // grab the _id from the request header
  let _id = req.header("_id")

  User.findByIdAndToken(_id, refreshToken).then((user) => {
    if(!user){
      // user not found
      return Promise.reject({'error': 'User not found'})
    }
    // if the code reaches here, the user was found
    req.user_id = user._id;
    req.refreshToken = refreshToken;
    req.userObject = user;
    let isSessionValid = false;

    user.sessions.forEach((session) => {
      if(session.token === refreshToken){
        if(User.hasRefreshTokenExpired(session.expiresAt) === false){
          isSessionValid = true;
        }
      }
    })

    if(isSessionValid){
      next();
    }else{
      return Promise.reject({'error': 'refresh token has expired or the session is invalid'});
    }
  }).catch((e)=>{
    res.status(401).send(e); 
  })
}

/* Route Handles*/

/* LIST ROUTES */
/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get("/lists", (req, res) => {
  // we wante to return an array of all the lists on the database
  List.find({}).then((lists) => {
    res.send(lists);
  }).catch((err) =>{
    log.error(err);
  });
});

/**
 * POST /lists
 * Purpose: Create a list
 */
app.post("/lists", (req, res) => {
  // We want to create a new list and return the new list document back to the user (which includes the id)
  // The list information (fields) will be passed in via the JSON request body
  const title = req.body.title;
  const newList = new List({ title });
  newList.save().then((listDoc) => res.send(listDoc));
});

/**
 * PATCH /lists/:id
 * Purpose: Update a specified list
 */
app.patch("/lists/:id", (req, res) => {
  // We want to update the specified list (list document with id in the URL) with the new values specified in the JSON body of the request
  List.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.sendStatus(200);
  })
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete("/lists/:id", (req, res) => {
  // we wante te delete the specified list (list document with id in the URL)
  List.findByIdAndDelete({ _id: req.params.id }).then((removedListDoc) => {
    res.send(removedListDoc);
  });
});
/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */
app.get("/lists/:listId/tasks", (req, res) => {
  // We want to return all tasks that belong to a specific list (specified by listId)
  Task.find({
    _listId: req.params.listId,
  }).then((tasks) => {
    res.send(tasks);
  });
});
/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new task in a specific list
 */
app.post("/lists/:listId/tasks", (req, res) => {
  // We want to create a new task in a list specified by listId
  let newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId,
  });
  newTask.save().then((newTaskDoc) => {
    res.send(newTaskDoc);
  });
});
/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing task
 */
app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  // We want to update an existing task (specified by taskId)
  Task.findByIdAndUpdate(
    {
      _id: req.params.taskId,
      _listId: req.params.listId,
    },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({message: "Task successfully completed"});
  });
});
/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete a task
 */
app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
    Task.findByIdAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
});

/* app.get("/lists/:listId/tasks/:taskId", (req, res) => {
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((task) => {
        res.send(task);
    });
}); */

/* USER ROUTE */

/* 
*POST /users
*Purpose: Sign up
*/
app.post("/users", (req, res) => {
  // User sign up
  let body = req.body;
  let newUser = new User(body);
  newUser.save().then(()=>{
    return newUser.createSession()
  }).then((refreshToken)=>{
    return newUser.generateAccessAuthToken().then((accessToken)=>{
      return {accessToken, refreshToken}
    })
  }).then((authTokens)=> {
    res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

/* 
*POST /users/login
*Purpose: Login
*/
app.post("/users/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  User.findByCredentials(email, password).then((user) => {
    return user.createSession().then((refreshToken)=>{
      return user.generateAccessAuthToken().then((accessToken)=>{
        return {accessToken, refreshToken}
      });
    }).then((authTokens)=> {
      res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(user);
    })
  }).catch((e) => {
    res.status(400).send(e);
  })
})

/* 
*GET /users/me/access-token
*Purpose: generate and return access token
*/
app.get("/users/me/access-token", verifySession, (req, res) =>{
  req.userObject.generateAccessAuthToken().then((accessToken) => {
    res.header('x-access-token', accessToken).send({accessToken})
  }).catch((e) => {
    res.status(400).send(e);
  })
})

const PORT = process.env.PORT || 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
