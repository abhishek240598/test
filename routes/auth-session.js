const express = require('express');
const router = express.Router();
const credential = require('../model/index');
const passport = require('passport');


router.post('/register', function(req, res){
    //validations
    req.checkBody('username', 'Username is required!!!').notEmpty().isLength({min: 5, max: 15}).withMessage('Username length should between 5-15');
    req.checkBody('password', 'Password is required!!!').notEmpty().isLength({min:8, max: 15}).withMessage('password length should between 8-15 ');
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({
            "response":{
                message: errors[0].msg,
                data: {}
            }
        });
    }else{
        credential.register(new credential({username: req.body.username}), req.body.password, function(err, newuser){
            if(err){
                res.status(400).json({
                    "response":{
                        message: err.message,
                        data: {}
                    }
                });
            }else{
                pasport.authenticate("local")(req, res, function(){
                    res.status(200).json({
                        "response":{
                            message: "Registered Successfully!!!",
                            data: {}
                        }
                    });
                });   
            }
        });
    }
});

router.post("/login", function(req, res, next){
    passport.authenticate('local', function(err, user, info){
        if(err){
            return res.status(400).json({
                "response":{
                    message: "something went wrong!!",
                    data: {}
                }
            });    
        }
        if(!user){
            return res.status(400).json({
                "response":{
                    message: "Invalid Username/password",
                    data: {}
                }
            });    
        }
        req.logIn(user, function(err) {
            if (err) { 
                return res.status(400).json({
                    "response":{
                        message: "Something went wrong!!!",
                        data: {}
                    }
                });    
             }else{
                return res.status(200).json({
                    "response":{
                        message: "Successfully LoggedIn!",
                        data: {}
                    }
                });    
             }                
          });
    })(req, res, next)
});

router.get('/logout', function(req, res, next){
    req.logOut();
    res.status(200).json({
        "response":{
            message: "Logout Successfully",
            data: {}
        }
    });
});


module.exports = router;