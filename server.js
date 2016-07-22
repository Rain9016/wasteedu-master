// Import modules
var express = require("express");
var app = express();
var path = require("path");


var bodyParser = require('body-parser');
var game_module = require('./routes/game');
var login_module = require('./routes/login');
var info_module = require('./routes/info');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// Set up the static files
app.use(express.static(__dirname + "/../wasteedu-master"));



// Set up the view engine
app.set('view engine', 'ejs');

// Load modules
app.use('/', game_module);
app.use('/', login_module);
app.use('/', info_module);



app.listen(3000, function(){
	console.log('Server is running at port 3000...');
});
