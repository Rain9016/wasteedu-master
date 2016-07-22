var express = require('express');
var router = express.Router();

// GET service
router.get("/guide", function(req,res){
	res.render('guidepage.ejs');
	console.log('enter guide page...')
});

module.exports = router;
