var express=require('express');
var router=express.Router();
var Campground=require('../models/campgrounds');
var middleware=require('../middleware');
//INDEX - Display list of all campgrounds
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
});

//NEW - Show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render('campgrounds/new');
});

//CREATE - Add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    };
    var newCampground={name: name, price: price, image: image, description: desc, author: author};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            req.flash('success','Campground added successfully');
            res.redirect("/campgrounds");
        }
    });
});

//SHOW - Get info about one particular campground
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

//EDIT - Get edit form for a campground
router.get("/:id/edit",middleware.checkCampgroundUser,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground:  foundCampground});
    });
});

//UPDATE - Update the campground in DB
router.put("/:id",middleware.checkCampgroundUser,function(req,res){
    req.body.campground.description=req.sanitize(req.body.campground.description);
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DELETE - Delete the campground
router.delete("/:id",middleware.checkCampgroundUser,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports=router;