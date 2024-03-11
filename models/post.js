const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Post = new Schema({
    user_firstName: {
        type: String,
        required: true
    },
    user_lastName: {
        type: String,
        required: true
    },
    // user_photo: {
    //     type: String,
    //     required: true
    // },
    postBody: {
        type: String,
        required: true
    },

    postPhoto: {
        type: String,
        required: false
    },
    
    likesNumber:{
        type: Number,
        default: 0
    },

    publication_date: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: Array,
        default: []

    }}, { collection: 'posts' }
);

module.exports = mongoose.model('Post', Post)