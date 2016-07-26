var express = require('express');
var router = express.Router();

router.get("/game", function(req,res){
    res.render('game.ejs');
    console.log('enter game page...')
});

router.get("/result", function(req,res){
    res.render('result.ejs');
    console.log('enter result page...')
});

router.get("/coffee_cups", function(req,res){
	res.render('coffee_cups.ejs');
	console.log('enter coffee_cups page...')
});

router.get("/rubbish_rain", function(req,res){
	res.render('rubbish_rain.ejs');
	console.log('enter rubbish_rain page...')
});

router.get("/match_color", function(req,res){
	res.render('match_color.ejs');
	console.log('enter match_color page...')
});

module.exports = router;
