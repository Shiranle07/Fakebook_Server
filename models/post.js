// models/post file
const mongoose = require("mongoose");
const { formatDistanceToNow } = require('date-fns');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
      user_email: {
        type: String,
        required: true
    },
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

    }}, { collection: 'posts' });

// Define a virtual property to format the distance to now
PostSchema.virtual('publication_date_formatted').get(function() {
    return formatDistanceToNow(this.publication_date, { addSuffix: true });
});

// Ensure virtual fields are serialized when converting to JSON
PostSchema.set('toJSON', { virtuals: true });

// Compile the schema into a model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
