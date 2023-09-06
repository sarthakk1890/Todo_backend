const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
        //Note that we are not using Date.now() as we don't want to call the funtion, the function will be called
        //when the Document will going to be inserted in the database
    },
});



const User = mongoose.model('users', UserSchema);
// User.createIndexes(); //for handling duplicate email, but we'll not use it
module.exports = User;