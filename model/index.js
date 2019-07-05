const mongoose = require('mongoose');
const passportLcalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLcalMongoose);

module.exports = mongoose.model('credential', userSchema);