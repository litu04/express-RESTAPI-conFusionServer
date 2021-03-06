var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');



const Dishes = require('./models/dishes');
const Leaders = require('./models/leaders');
const Promotions = require('./models/promotions');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

connect.then((db) => {
  console.log("Connected to mongodb server");
}, (err) => {console.log("Error: ",err);} )

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));   // using the secret key inside cookieParser()

// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new fileStore()
// }));

app.use(passport.initialize());
//app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//using session
// function auth(req,res,next){
//   //console.log("session: ",req.session);
//   console.log("user: ",req.user);

//   if(!req.user){
//         var err = new Error("You are not authenticated!");
//         err.status = 403;
//         next(err);
//       }else{
//         next();
//       }
// }

// // function for basic authorization
// function auth(req,res,next){
//   console.log("Headers: ",req.headers);  // content for request headers

//   var authHeader = req.headers.authorization;  // gethold of the authorization header

//   if(!authHeader){ // if authHeader is null

//     var err = new Error("You are not authenticated!");
//     res.setHeader('WWW-Authenticate','Basic'); // asking the client to pass me the authorization header
//     err.status = 401;
//     return next(err);
//   }
//   var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
//   var username = auth[0];
//   var password = auth[1];

//   if(username === 'admin' && password === 'password'){
//     next(); // req will pass to the next middleware
//   } else{
//     var err = new Error("You are not authenticated!");
//     res.setHeader('WWW-Authenticate','Basic');
//     err.status = 401;
//     return next(err);
//   }
// }

// basic auth setting up cookies in the server
// function auth(req,res,next){
//   console.log("cookies: ",req.signedCookies.user);

//   if(!req.signedCookies.user){
//       var authHeader = req.headers.authorization;  // gethold of the authorization header

//       if(!authHeader){ // if authHeader is null

//         var err = new Error("You are not authenticated!");
//         res.setHeader('WWW-Authenticate','Basic'); // asking the client to pass me the authorization header
//         err.status = 401;
//         return next(err);
//       }
//       var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
//       var username = auth[0];
//       var password = auth[1];

//       if(username === 'admin' && password === 'password'){
//         res.cookie('user','admin',{signed:true})
//         next(); // req will pass to the next middleware
//       } else{
//         var err = new Error("You are not authenticated!");
//         res.setHeader('WWW-Authenticate','Basic');
//         err.status = 401;
//         return next(err);
//       }
//   } else {
//     if(req.signedCookies.user === 'admin'){
//       next();
//     } else {
//       var err = new Error("You are not authenticated!");
//       err.status = 401;
//       return next(err);
//     }
//   }
// }

//app.use(auth); // before client access any of the resources client needs to be authorized
app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
