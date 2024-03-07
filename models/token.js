const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Token = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Token expires after 1 hour
    }
});

module.exports = mongoose.model('Token', Token);
