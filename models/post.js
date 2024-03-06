const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Post = new Schema({
    postBody: {
        type: String,
        required: true
    },
    // postPhoto: {
    //     type: BigInt64Array,
    //     required: false
    // },
    time: {
        type: Date,
        default: Date.now
    }}, { collection: 'posts' }
);

module.exports = mongoose.model('Post', Post)