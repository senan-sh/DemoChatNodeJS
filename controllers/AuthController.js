const _user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const max_age = 60 * 60 * 24 * 2;
const createJWT = async (id) => {
    const jwt_token = await jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: max_age });
    return jwt_token;
}

module.exports = {
    RegisterPost: async (req, res) => {
        const { email, password, password2 } = req.body;
        if (!email || !password || password != password2) {
            res.render('home', req.body)
        } else {
            try {
                const enc_password = await bcrypt.hash(password, 10)
                _user.create({
                    email: email,
                    password: enc_password
                })
                res.render('home')
            } catch (e) {
                res.render('home', req.body)
            }
        }
    },
    LoginPost: async (req, res) => {
        const { username, password } = req.body;
        const user = await _user.findOne({ "email": username });
        if (!user) {
            res.render('home');
        } else {
            const pass_success = await bcrypt.compare(password, user.password);
            if (!pass_success) {
                res.render('home');
            } else {
                const token = await createJWT(user._id);
                res.cookie('jwt_token', token, { 'maxAge': max_age * 1000, 'httpOnly': true });
                res.redirect('/chat/');
            }
        }
    },
    GetUser: async (req, res, next) => {
        const cookie_enc = req.cookies.jwt_token;
        if (!cookie_enc) {
            res.render('home');
        } else {
            const { id } = await jwt.verify(cookie_enc, process.env.SECRET_KEY);
            if (!id) {
                res.render('home');
            } else {
                const user = await _user.findById(id, ["id","email"]);
                res.user = user;
                next();
            }
        }
    }
}