module.exports = function(app, passport) {

    // Home page
    app.get('/', function(req, res){
        // render our main page
        res.render('index.ejs');
    });

    // Show the login form
    app.get("/login",function(req, res){
        // render the page and pass in any flash data if it exists
    	res.render('login.ejs', { message: req.flash('loginMessage') } );
    });

    // process the login form
    // app.get('/login', );

    // Show the sign up form
    app.get("/signup", function(req,res){
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    /*
    app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});
    */

    // Guide Page
    app.get("/guide", function(req,res){
    	res.render('guidepage.ejs');
    });

    // Game Page
    app.get("/game", function(req,res){
        res.render('game.ejs');
        console.log('enter game page...')
    });

    // Show the players' scores
    app.get("/result", function(req,res){
        res.render('result.ejs');
        console.log('enter result page...')
    });

    // Render to the coffee_cups.ejs
    app.get("/coffee_cups", function(req,res){
    	res.render('coffee_cups.ejs');
    });

    // Render to the rubbish_rain.ejs
    app.get("/rubbish_rain", function(req,res){
    	res.render('rubbish_rain.ejs');
    });

    // Render to the match_color.ejs
    app.get("/match_color", function(req,res){
    	res.render('match_color.ejs');
    });

    //　Render to the container_sort.ejs
    app.get("/container_sort", function(req,res){
    	res.render('container_sort.ejs');
    	console.log('enter container_sort page...')
    });

}
