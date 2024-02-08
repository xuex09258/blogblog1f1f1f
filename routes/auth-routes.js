const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth-controller');

//@router POST api/auth/login
//@desc 使用者登入
//@access Public
router.post('/login', authControllers.login); 

//@router POST api/auth/register
//@desc 使用者註冊
//@access Public
router.post('/register',authControllers.registerUser);

module.exports = router