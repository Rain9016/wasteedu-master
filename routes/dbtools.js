module.exports = {
	this.mysql = require('mysql');
	// Connection pool
	this.pool = mysql.createPool({
		connectionLimit : 100,
		host	 : 'localhost',
		user 	 : 'root',
		password : 'root',
		database : 'greenfund',
		debug	 : false
	});

	pool.getConnection(function(err,connection){
		
		if(err){
			connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
			return;
		}

	}
}