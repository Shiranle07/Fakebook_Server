// models/user file
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const User = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    profilePhoto: {
        type: String,
        //type: BigInt64Array,
        default: "defaultProfilePhoto.jpg"
    },
    friends: [{
        type: String,
        // type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    friend_reqs_sent: [{
        type: String,
        // type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    friend_reqs_received: [{
        type: String,
        // type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { collection: 'users' }
);

module.exports = mongoose.model('User', User)