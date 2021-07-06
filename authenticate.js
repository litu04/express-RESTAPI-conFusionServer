const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;  // provided by passport node module strategy
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');


module.exports = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});   // help us to create the token(payload,secret-key,additional options)
}

var opts = {};
// this option specifies how the jwttoken will be extracted from the incoming request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey; // help me to supply the secret key

// creating a new strategy
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload,done) => {
        console.log("JWT_Payload: ",jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err,user) => {
            if(err){
                return done(err,false);
            } else if(user){
                return done(null,user);
            } else {
                // we couldn't find the user
                return done(null,false);
            }
        });
    }));

// using the jwt strategy we can verify the user based on the token
//exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyUser = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }
}