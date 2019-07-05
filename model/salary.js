var mongoose = require('mongoose');

var salarySchema = new mongoose.Schema({
    salary: Number,
    month: String
});

module.exports = mongoose.model('salary', salarySchema);

