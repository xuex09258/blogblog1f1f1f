const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users-controller');
const auth = require("../middleware/auth"); //引入我們剛剛的auth middleware

//@router GET api/users/:userId/posts
//@desc 取得使用者發佈的文章
//@access Public
router.get('/:userId/posts', auth, userControllers.getUserPosts);

//@router GET api/users/:userId/profile
//@desc GET 取得使用者資訊
//@access Public
router.get('/:userId/profile', auth, userControllers.getUserProfile);

//@router PUT api/users/:userId/profile
//@desc PUT 修改使用者資料
//@access Public
router.put('/:userId/profile', auth, userControllers.updateUserProfile);

module.exports = router;