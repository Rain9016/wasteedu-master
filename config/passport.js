// import modules we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');

module.exports = function(passport) {

    /*
     * PassPort session setup
     *
     * required for persistent login sessions.
     * passport needs ability to serialise and unserialise users out of session
     *
     */

     // used to serialise the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /*
     * Login & Singup
     *
     * We are using named strategies as we have one for login and one for signup.
     * By default, if there was no name, it would just be called 'local'
     *
     */

     passport.use('local-signup', new LocalStrategy({
         // by default, local strategy uses username and password
         usernameField : 'username',
         passwordField : 'password',
         // allows us to pass back the entire request to the callback
         passReqToCallback : true
     }, function(req, username, password, done) {
         // User.findOne wont fire unless data is sent back
         process.nextTick(function() {

             // find a user whose username is the same as the forms username
             // we are checking to see if the user trying to login already exists
             User.findOne({'local.username' : username}, function(err, user) {
                 // if there are any errors, return the error
                 if(err)
                    return done(err);

                // check to see if there's already a username
                if(user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {

                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    newUser.local.username = username;
                    //newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
         });
     }));

     /*
      * Similar to the sign up strategy.
      * Provide a strategy to passport called 'local-login'. Will use this strategy
      * to process our login form.
      */
     passport.use('local-login', new LocalStrategy({
         usernameField : 'username',
         passwordField : 'password',
         passReqToCallback : true
     },function(req, username, password, done) {

         User.findOne({'local.username' : username }, function(err, user) {
             if(err)
                return err;

             // if no user is found, return the message
             if(!user)
                return done(null, false, req.flash('loginMessage', 'Invalid user name'));

             // if the user is found but the password is wrong
             if(!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Invalid Password'));

             // all is well, return sccessful user
             return done(null, user);
         });
     }));
};
