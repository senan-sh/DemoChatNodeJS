const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cookie_parser = require('cookie-parser');
// const server = require('http').createServer(app);
require('dotenv').config();
// const io = require('socket.io')(server);

// mongoose.connect(process.env.DB_CONNECTION_URL,
    // mongodb+srv://senan_exe_pseudocoder:rkKWWbM8GQRSHEci@cluster0.ecztp.mongodb.net/DARK?retryWrites=true&w=majority
    // mongodb://localhost:27017/dark_social
    // { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'static')));
app.use(cookie_parser());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('home');
});
// const ChatRouter = require('./routes/chat')(io);
// const AuthRouter = require('./routes/auth');
// app.use('/chat', ChatRouter);
// app.use('/auth', AuthRouter);
app.listen(process.env.PORT);