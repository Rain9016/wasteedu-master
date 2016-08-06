// Import all modules we need
var express = require("express");
var app = express();
var passport = require('passport');
var flash = require('connect-flash');

var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var configDB = require('./config/database.js');

var bodyParser = require('body-parser');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'iamdickydoingwasteeduproject' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Set up the static files
app.use(express.static('public'));

// Set up the view engine
app.set('view engine', 'ejs');

// pass passport for configuration
require('./config/passport')(passport);

// load our routes and pass in our app
require('./routes/routes.js')(app, passport);

// connect to our database
mongoose.connect(configDB.url);

// launch our server
app.listen(port, function(){
	console.log('Express started on http://localhost:' + port);
});
