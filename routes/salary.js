const express = require('express');
var router = express.Router({ mergeParams: true });//here parent id assign is not merging with child id so this is statement requiredddddddddddddddddddd!
var user = require('../model/user');

//POST- add salary
router.post('/addsalary', function (req, res) {

//Find user by id and then add salary
    user.findById(req.params.id, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.status(400).json({
                "response": {
                    status: 400,
                    message: "Something went wrong!",
                    data: {
                        error: err
                    }
                }
            });
        } else {
            //validate salaryz
            req.checkBody('salary', 'Please Enter Numeric Value').isNumeric();
            var errors = req.validationErrors();
            if (errors) {
                res.status(400).json({
                    "response": {
                        status: 400,
                        message: "Invalid Data Entry",
                        data: {
                            error: errors[0].msg
                        }
                    }
                });
            } else {
                var sal = {
                    salary: req.body.salary,
                    month: req.body.month
                }
                Salary.create(sal, function (err, newsal) {
                    if (err) {
                        res.status(400).json({
                            "response": {
                                status: 400,
                                message: "Something went wrong!",
                                data: {}
                            }
                        });
                    } else {
                        foundUser.salary.push(newsal);
                        foundUser.save();
                        res.status(200).json({
                            "response": {
                                status: 200,
                                message: "Salary saved successfully",
                                data: newsal
                            }
                        });
                    }
                });
            }
        }
    });
});


//PUT- edit salary
router.put('/:salary_id/edit', function(req, res){
    Salary.findByIdAndUpdate(req.params.salary_id, req.body, function(err, updatedsalary){
        if(err){
            res.status(400).json({
                "response": {
                    status: 400,
                    message: "Something went wrong!",
                    data: {}
                }
            });
        }else{
            res.status(200).json({
                "response": {
                    status: 200,
                    message: "Salary updated!!!",
                    data: updatedsalary
                }
            });
        }
    });
});

//Delete- delete salary
router.delete('/:salary_id/delete', function(req, res){
    Salary.findByIdAndDelete(req.params.salary_id, function(err, deletedsalary){
        if(err){
            res.status(400).json({
                "response": {
                    status: 400,
                    message: "Something went wrong!!!",
                    data: {}
                }
            });
        }else{
            res.status(200).json({
                "response": {
                    status: 200,
                    message: "Deleted Successfully!!!",
                    data: {}
                }
            });
        }
    });
});


module.exports = router;