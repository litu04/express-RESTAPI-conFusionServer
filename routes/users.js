var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signUp',function(req,res,next){
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null){
      var err = new Error('Username ' + req.body.username + ' already exist!');
      err.status = 403;
      return next(err);
    } else {
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  },(err) => next(err))
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({status: 'Registration Successfull', user:user});
  }, (err) => next(err))
  .catch(err => next(err));
});

router.post('/login',(req,res,next) => {
  // if the user is not yet authenticated
  if(!req.session.user){
      var authHeader = req.headers.authorization;  // gethold of the authorization header

      if(!authHeader){ // if authHeader is null

        var err = new Error("You are not authenticated!");
        res.setHeader('WWW-Authenticate','Basic'); // asking the client to pass me the authorization header
        err.status = 401;
        return next(err);
      }
      var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
      var username = auth[0];
      var password = auth[1];

      User.findOne({username : username})
      .then((user) => {
        // if user doesn't exist
        if(user === null){
          var err = new Error('User ' + username + ' does not exist');
          err.status = 403;
          return next(err);
        } else if(user.password !== password){
          var err = new Error("Your password is incorrect");
          err.status = 403;
          return next(err);
        } else if(user.username === username && user.password === password){
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type','text/plain');
          res.end("You are authenticated!");
        } else{
          var err = new Error("You are not authenticated!");
          res.setHeader('WWW-Authenticate','Basic');
          err.status = 401;
          return next(err);
        }
      })
      .catch((err) => next(err))
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end("You are already authenticated");
  }
});

router.get('/logout',(req,res) => {
  if(req.session){
    req.session.destroy();    // for logout by destroying the session cookie
    res.clearCookie('session-id');   // deleting the cookie from the client side
    res.redirect('/');
  } else {
    var err = new Error('You are not logged in');
    err.status = 403;
    next(err);
  }
})

module.exports = router;
