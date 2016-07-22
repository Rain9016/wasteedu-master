var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();
// All types
var allAccTypes = ['greenfund', 'facebook'];

var cryptoKey = '8ff32489f92f33416694be8fdc2d4c22'; // encrypt/decrypt key

// Set the cookie and session
app.use(cookieParser());
app.use(session({ 
	secret: '8ff32489f92f33416694be8fdc2d4c22', 
	cookie: { maxAge: 60000 }
}));


// Connection pool
var pool = mysql.createPool({
	connectionLimit : 100,
	host	 : 'localhost',
	user 	 : 'root',
	password : 'root',
	database : 'greenfund',
	debug	 : false
});

// Encrypt message
function encrypt(text){
	var cipher = crypto.createCipher('aes-256-cbc', cryptoKey)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

// Decrypt message
function decrypt(text){
	var decipher = crypto.createDecipher('aes-256-cbc', cryptoKey)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}


// GET service
router.get("/log",function(req,res){
	res.render('login.ejs');
	console.log('enter login page...');
});

router.get("/register", function(req,res){
	res.render('register.ejs');
	console.log('enter register page...')
});

// POST service
router.post('/login', function(req, res){

	pool.getConnection(function(err,connection){

		if(err){
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}

		// console.log(req.body.accid);

		// Facebook handler
	if(req.body.acctype == 'fb'){

			connection.query('SELECT COUNT(*) AS totalCount FROM socialmedia WHERE socid = ? and type = ?', [encrypt(req.body.accid), req.body.acctype] ,function(err,rows){
				if(err) throw err;

				console.log('Total count:' + rows[0].totalCount);

				if(rows[0].totalCount == 0)
				{
					var newUser = {type: req.body.acctype, socid: encrypt(req.body.accid)};
					connection.query('INSERT INTO socialmedia SET ?', newUser, function(err, res){
						if(err) throw err;
						console.log('Last insert ID:', res.insertId);
					});
					res.render('guidepage.ejs');
				}
				if(rows[0].totalCount == 1){
					console.log("Success redirect");
					res.render('guidepage.ejs');
				}
				if(req.session.user){
					console.log("Print the cookie!");
					console.log(req.session.id);
				}else{
					req.session.user = encrypt('facebook:'+req.body.accid);
					console.log("Set the cookie!");
				}
			});
	// Original account handler	
}else{

	connection.query('SELECT COUNT(*) AS totalCount FROM user WHERE username = ? and password = ?', [encrypt(req.body.username), encrypt(req.body.password)] ,function(err,rows){
		if(err) throw err;

		console.log('Total count:' + rows[0].totalCount);

		if(rows[0].totalCount == 0)
			res.render('login.ejs');
		if(rows[0].totalCount == 1)
		{
			connection.query('SELECT * FROM user WHERE username = ? and password = ?', [encrypt(req.body.username), encrypt(req.body.password)] ,function(err,rows){
				if(req.session.user){
					console.log("Print the cookie!");
					console.log(req.session.user);
				}else{
					req.session.user = encrypt('greenfund:'+rows[0].id);
					console.log("Set the cookie!");
				}
				res.render('guidepage.ejs');
			});
		}
	});
}

connection.on('error', function(err) {      
	res.json({"code" : 100, "status" : "Error in connection database"});
	return;     
});

});


});

// Register service
router.post('/register', function(req, res){
	
	console.log("register:"+req.body.username);

	pool.getConnection(function(err,connection){
		if(err){
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}

		var newUser = {username : encrypt(req.body.username), password : encrypt(req.body.password), email : encrypt(req.body.email)};

		console.log('connected as id' + connection.threadId);

		connection.query('INSERT INTO user SET ?', newUser, function(err, res){
			if(err) throw err;
			console.log('Last insert ID:', res.insertId);
		});

		connection.on('error', function(err) {      
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;     
		});

	});

	res.render('login.ejs');
});

module.exports = router;