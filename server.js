// Import modules
var express = require("express");
var app = express();
var path = require("path");
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var game_module = require('./routes/game');
var login_module = require('./routes/login');
var info_module = require('./routes/info');

// Listen to the port which is provided by the env, otherwise set the port as 3000
http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
})

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Set up the static files
app.use(express.static('public'));

// Main page
app.get('/', function(req, res){
  res.render('index');
});

// Set up the view engine
app.set('view engine', 'ejs');

// Load modules
app.use('/', game_module);
app.use('/', login_module);
app.use('/', info_module);


app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port'));
});
