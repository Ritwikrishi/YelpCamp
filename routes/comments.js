var express=require('express');
var router=express.Router({mergeParams: true});
var Campground = require('../models/campgrounds'),
    Comment = require('../models/comments');
var middleware=require('../middleware');
//New
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }
    });
});

//Create
router.post("/",middleware.isLoggedIn,function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id,function(err, campground) {
       if(err){
           console.log(err);
       } else{
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   req.flash('error','Something went wrong');
                   console.log(err);
               }else{
                   //add username and id to comment and save comment
                   comment.author.id=req.user._id;
                   comment.author.username=req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash('success','Comment added successfully');
                   res.redirect("/campgrounds/"+campground._id);
               }
           });
       }
    });
    //create new comment and add to campground
    //redirect campgrounds show page
});
//EDIT
router.get("/:cid/edit",middleware.checkCommentUser,function(req,res){
    Comment.findById(req.params.cid,function(err, foundComment) {
       if(err){
           res.redirect("back");
       } else{
           res.render("comments/edit",{campground_id: req.params.id,comment: foundComment});
       }
    });
});
//UPDATE
router.put("/:cid",middleware.checkCommentUser,function(req,res){
    req.body.comment.text=req.sanitize(req.body.comment.text);
    Comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//DELETE
router.delete("/:cid",middleware.checkCommentUser,function(req,res){
    Comment.findByIdAndRemove(req.params.cid,function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash('success','Comment deleted');
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports=router;