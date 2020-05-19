var express=require('express');
var router=express.Router();
var passport = require('passport');
var Campground = require('../models/campgrounds'),
       Comment = require('../models/comments'),
          User = require('../models/users');
          
//HOME - Show yelpcamp home page
router.get("/",function(req,res){
    res.render("landing");
});
//RegisterNew - Form for signUp
router.get('/register',function(req,res){
    res.render('register');
});
//RegisterCreate - Register user to database and start session if new user
router.post('/register',function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            req.flash('error',err.message);
            res.redirect('/register');
        }else{
            passport.authenticate('local')(req,res,function(){
                req.flash('success',"Welcome to YelpCamp"+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});
//LoginNew - Show form for login
router.get('/login',function(req,res){
    res.render('login');
});
//LoginCreate - Authenticate the user and start session if correct user
router.post('/login',passport.authenticate('local',{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
        }),function(req,res){
});
//Logout - To logout a user from session
router.get('/logout',function(req,res){
    req.logout();
    req.flash("error","Logged you out!");
    res.redirect('/campgrounds');
});

module.exports=router;