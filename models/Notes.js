const mongoose = require('mongoose');
const {Schema} = mongoose

const NotesSchema = new Schema({
    user:{ //it is added so that the notes of someone else cannot be accessed by someone 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
        //Note that we are not using Date.now() as we don't want to call the funtion, the function will be called
        //when the Document will going to be inserted in the database
    },
});

module.exports = mongoose.model('notes', NotesSchema);