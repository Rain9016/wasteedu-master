var express = require('express');
var router = express.Router();

router.get("/game", function(req,res){
    res.render('game.ejs');
    console.log('enter guide page...')
});

router.get("/result", function(req,res){
    res.render('result.ejs');
    console.log('enter guide page...')
});

router.get("/game_alpha", function(req,res){
	res.render('game_alpha.ejs');
	console.log('enter game alpha...')
});

router.get("/game_beta", function(req,res){
	res.render('game_beta.ejs');
	console.log('enter guide beta...')
});

router.get("/game_gamma", function(req,res){
	res.render('game_gamma.ejs');
	console.log('enter game gamma...')
});

module.exports = router;