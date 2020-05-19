//Requiring all the npm packages -----------------------------------------------
var passportLocalMongoose = require('passport-local-mongoose'),
            localStrategy = require('passport-local'),
                 passport = require('passport'),   
                  express = require('express'),
                     app  = express(),
               bodyParser = require('body-parser'),
                mongoose  = require('mongoose'),
           methodOverride = require('method-override'),
         expressSanitizer = require('express-sanitizer'),
                  session = require('express-session'),
                    flash = require('connect-flash');
                    
//Requiring routes and User model ----------------------------------------------
var campgroundsRoutes = require('./routes/campgrounds'),
    commentRoutes     = require('./routes/comments'),
    indexRoutes       = require('./routes/index'),
    User              = require('./models/users');

//APP CONFIG -------------------------------------------------------------------
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
app.set('view engine','ejs');

//seed the database

//Passport Config --------------------------------------------------------------
app.use(session({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Using diff routes with currentUser -------------------------------------------
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp server has started!");
});