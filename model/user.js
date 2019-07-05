var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
    name:{
        firstname: String,
        lastname: String
    },
    gender: String,
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        uniqueCaseInsensitive: true
    },
    password: String,
    salary:[
         {
          type: mongoose.Schema.Types.ObjectId,
          ref: "salary"
         }
      ],
    dob: Date
});

//userSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

var userModel = mongoose.model('user', userSchema);

module.exports = userModel;