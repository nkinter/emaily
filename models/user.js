var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    googleId: String,
    firstName: String,
    lastName: String,
    gender: String,
    email: String
});

mongoose.model('users', userSchema);