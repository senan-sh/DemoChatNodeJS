const express = require('express');
const router = express.Router();
const { RegisterPost, LoginPost } = require('../controllers/AuthController');



router.post('/register', RegisterPost);
router.post('/login', LoginPost);
module.exports = router