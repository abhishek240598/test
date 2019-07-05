var express = require('express');
var user = require('../model/user');
var salary = require('../model/salary');
var bcrypt = require('bcrypt');
var moment = require('moment');
var middlewareObj = require('../middleware/auth');
//var func = require('../functions');
var BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();

//GET -retrive all users
router.get("/",function (req, res) {
  
    //validationa
    req.checkHeaders('User-Id', 'Please Enter User-id').notEmpty();

    var errors = req.validationErrors();
    if(errors){
      res.status(400).json({
        "response": {
          status: 400,
          message: errors[0].msg,
          data: {}
        }
      });
    }else{
      //find all the users from db and not display password field
      user.find({}, {password: 0}, function (err, data) {
        if (err) {
          res.status(400).json({
            "response": {
              status: 400,
              message: "Can not get users",
              data: {}
            }
          });
        }else{
          res.status(200).json({
            "response": {
              status: 200,
              message: "All Users",
              data: data
            }
          });
        }
      });  
    }
});

//POST  - add new user
router.post("/adduser", function (req, res) {
  // validations
  req.checkBody('firstname', 'Firstname field is required!').notEmpty();
  req.checkBody('firstname', 'Length should between 3 to 10').isLength({ min: 3, max: 10 });
  req.checkBody('lastname', 'Lastname field is required!').notEmpty();
  req.checkBody('lastname', 'Length should between 3 to 10').isLength({ min: 3, max: 10 });
  req.checkBody('gender', 'Gender field is required!').notEmpty();
  req.checkBody('email', 'Email field is required!').notEmpty();
  req.checkBody('email', 'Please enter valid Email id!').isEmail();
  req.checkBody('password', 'Password field is required!').notEmpty();
  req.checkBody('dob', 'DateOfBirth is required!').notEmpty();
  //check for validations
  var errors = req.validationErrors();
  //validation error handling
  if (errors) {
    res.status(400).json({
      "response": {
        status: 400,
        message: errors[0].msg,
        data: {}
      }
    });
  }else{
    const emaill = req.body.email;
    user.find({email: emaill}, function(err, email){
      if(err){
        res.status(400).json({
          "response": {
            status: 400,
            message: err.message,
            data: {}
          }
        });
      }else{
        if(email.length > 0){
          res.status(400).json({
            "response": {
              status: 400,
              message: "Email already exsits!!!",
              data: {}
            }
          });
        }else{
          bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS).then(function (hashedpasword) {
            var date = req.body.dob;
            var birth = moment(date, 'DD-MM-YYYY').toDate();
            var name = {
              firstname: req.body.firstname,
              lastname: req.body.lastname
            }
            var newuser = {
              name: name,
              gender: req.body.gender,
              email: req.body.email,
              password: hashedpasword,
              dob: birth
              
            }
            var person = new user(newuser);
            person.save(newuser, function (err, saveduser) {
              if (err) {
                res.status(400).json({
                  "response": {
                    message: err.message,
                    data: {}
                  }
                });
              }else{
                var user = saveduser.toObject();
                delete user.password;
                res.status(200).json({
                  "response": {
                    message: "New User is added!",
                    data: user
                  }
                });
              }
            });
          });
        }
      }
    });
  }
});

//PUT - edit user
router.put('/:id/edit', function(req, res){
  
  var data = req.body;
  // validations
  req.checkBody('firstname', 'Firstname field is required!').notEmpty();
  req.checkBody('firstname', 'Length should between 3 to 10').isLength({ min: 3, max: 10 })
  req.checkBody('lastname', 'Lastname field is required!').notEmpty();
  req.checkBody('lastname', 'Length should between 3 to 10').isLength({ min: 3, max: 10 })
  req.checkBody('gender', 'Gender field is required!').notEmpty();
  req.checkBody('email', 'Email field is required!').notEmpty();
  req.checkBody('email', 'Please enter valid Email id!').isEmail();
  req.checkBody('dob', 'DateOfBirth is required!').notEmpty();

  //check for validations
  var errors = req.validationErrors();
  //validation error handling
  if (errors) {
    res.status(400).json({
      "response": {
        status: 400,
        message: errors[0].msg,
        data: {}
      }
    });
  }  
  var email = data.email;
  var id = req.params.id;
  var date = req.body.dob;
  var birth = moment(date, 'DD-MM-YYYY').toDate();
  user.find({_id:{$ne: id},'email': email}, function(err, email){
    if(err){
      res.status(400).json({
        "response": {
          status: 400,
          message: "Something went wrong!!!",
          data: {}
        }
      });
    }else{
      if(email.length > 0){
        res.status(400).json({
          "response": {
            status: 400,
            message: "Email already Exists!!!",
            data: {}
          }
        });
      }else{
        var updateuser = {
          name: {
            firstname: data.firstname,
            lastname: data.lastname
          },
          gender: data.gender,
          email: data.email,
          dob: birth
        }
        user.findByIdAndUpdate(req.params.id, updateuser, function(err, updateduser){
          if(err){
            res.status(400).json({
              "response": {
                status: 400,
                message: "Something went wrong!!!",
                data: updateduser
              }
            });
          }else{
            res.status(200).json({
              "response": {
                status: 200,
                message: "Data Updated!!!",
                data: updateduser
              }
            });
          }
        });
      }
    }
  });
});

//DELETE  - delete user
router.delete('/:id/delete', function (req, res) {
  var id = req.params.id;
  //delete id then object that need to update then callback
  user.findByIdAndDelete(id, function(err, user){
    if(err){
      return res.status(400).json({
        "response": {
          status: 400,
          message: "Something went wrong!!!",
          data: {}
        }
      });
    }else{
      var sal = user.salary;
      sal.forEach(function(saal){
        salary.findByIdAndDelete(saal, function(error, salary){
          if(error){
            return res.status(400).json({
              "response": {
                status: 400,
                message: "Something went wrong!!",
                data: {}
              }
            });
          }else{
            console.log(salary);
          }
        });
      });
      return res.status(200).json({
        "response": {
          status: 200,
          message: "User Deleted Successfully!!!",
          data: {}
        }
      });
    }
  });
});

//GET - get single user details
router.get("/:id", function(req, res){
  user.findById(req.params.id).populate('salary').exec(function(err, user){
    if(err){
      res.status(400).json({
        "response": {
          status: 400,
          message: "Can't Find user!",
          data: {}
        }
      });
    }else{
      var oneuser = user.toObject();
      delete oneuser.password;
      var string = moment(user.dob).format('DD-MM-YYYY').toString();
      var age=Math.floor(moment(new Date()).diff(moment(string,"DD/MM/YYYY"),'years',true));
      oneuser.age = age;
      res.status(200).json({
        "response": {
          status: 200,
          message: "User Found!!!",
          data: oneuser
        }
      });
    }
  });
}); 

//Invalidate request
router.get('*', function (req, res) {
  return res.status(400).json({
    "response": {
      status: 400,
      message: "This request is not valid",
      data:{}
    }
  });
});

module.exports = router;
