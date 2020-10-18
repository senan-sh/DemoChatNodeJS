const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
});

module.exports = mongoose.model('conversation', ConversationSchema);