const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    active_sockets: [
        {
            type: String,
        }
    ],
    noHash: {
        type: String,
        required: false
    },
    last_seen:{
        type:Date,
        required:false
    }
})
module.exports = mongoose.model('user', UserSchema);