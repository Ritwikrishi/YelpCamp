var Campground = require('../models/campgrounds'),
    Comment = require('../models/comments');
    
var middlewareObj={};
middlewareObj.isLoggedIn=function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.checkCampgroundUser=function (req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
               if(err){
                   req.flash('error','Campground not found');
                   res.redirect("back");
               }else{
                   if(foundCampground.author.id.equals(req.user._id)){
                        next();
                   }else{
                       req.flash('error',"You don't have permission to do that");
                       res.redirect("back");
                   }
               }
        });
    }
    else{
        req.flash('error','You need to be logged in to do that');
        res.redirect("back");
    }
};

middlewareObj.checkCommentUser=function (req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.cid,function(err,foundComment){
               if(err){
                   res.redirect("back");
               }else{
                   if(foundComment.author.id.equals(req.user._id)){
                        next();
                   }else{
                       req.flash('error',"You don't have permission to do that");
                       res.redirect("back");
                   }
               }
        });
    }
    else{
        req.flash('error','You need to be logged in to do that');
        res.redirect("back");
    }
};

module.exports=middlewareObj;