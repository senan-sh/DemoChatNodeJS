const _conversation = require('../models/conversation');
const _user = require('../models/user');
const _message = require('../models/message');
const jwt = require('jsonwebtoken');
const GMT_4 = 1000 * 60 * 60 * 4;

module.exports = function (io) {
    io.on('connection', (socket) => {
        let user_id;
        socket.on('add_sId_to_db', async (id) => {
            user_id = id;
            await _user.findByIdAndUpdate(id, { last_seen: Date.now() + GMT_4, $push: { "active_sockets": socket.id } }, { useFindAndModify: true });
        });//FALSE
        socket.on('update_last_seen', (async (id) => {
            await _user.findByIdAndUpdate(id, { last_seen: Date.now() + GMT_4 }, { useFindAndModify: true });
        }));
        socket.on('disconnect', async (io) => {
            await _user.findByIdAndUpdate(user_id, { $pull: { "active_sockets": socket.id } }, { useFindAndModify: false });
        });
        socket.on("send_message", async (body) => {
            const decoded = await jwt.verify(body.chat_token_jwt, process.env.SECRET_KEY);
            await _message.create({
                text: body.message,
                conversation: decoded.conv_id,
                from: decoded.my_id
            });
            const { active_sockets } = await _user.findById(decoded.to, ['active_sockets']);
            for (const socket of active_sockets) {
                io.to(socket).emit("get_message", { "message": body.message, "id": decoded.my_id });
            };
            socket.emit('sent_message', body.message)
        })
    })
    const ChatController = {
        ChatPage: async (req, res, next) => {
            res.locals.user = await res.user;
            res.render('chat');
        },
        BringConversation: async (req, res, next) => {
            const to_user = await _user.findOne({ "email": req.query.email });
            if (!to_user) {
                res.status(404).end();
            } else {
                const conversation = await _conversation.findOne({ members: { $all: [to_user._id, res.user._id] } });
                if (!conversation) {
                    const new_conversation = await _conversation.create({
                        members: [to_user._id, res.user._id]
                    });
                    const chat_token = jwt.sign({ "my_id": res.user._id, "to": to_user._id, "conv_id": new_conversation._id }, process.env.SECRET_KEY)
                    res.json({ chat_token, "email": req.query.email });
                } else {
                    const init_messages = await _message.find({ "conversation": conversation._id }).sort({ "createdAt": -1 }).limit(10);
                    const chat_token = jwt.sign({ "my_id": res.user._id, "to": to_user._id, "conv_id": conversation._id }, process.env.SECRET_KEY);
                    await _user.findByIdAndUpdate(res.user_id, { last_seen: Date.now() + GMT_4 }, { useFindAndModify: true });
                    res.json({ init_messages, chat_token, "to": to_user._id })
                }
            }
        }
    }
    return ChatController;
}