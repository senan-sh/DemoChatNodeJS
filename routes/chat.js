const express = require('express');
const router = express.Router();
const { GetUser } = require('../controllers/AuthController');

module.exports = function (io) {
    const ChatController = require('../controllers/ChatController')(io);
    router.get('/', GetUser, ChatController.ChatPage);
    router.get('/search_user', GetUser, ChatController.BringConversation);
    return router;
};