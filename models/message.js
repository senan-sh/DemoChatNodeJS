const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation"
    },
    text:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('message', MessageSchema);