const express = require('express');
const router = express.Router();
//const postController = require("../firstcontroller");
const postController = require("../controllers/postcontroller");

//@router POST /api/posts
//@desc 新增文章
//@access Public
router.post("/", postController.createPost);

//@router  GET api/posts
//@desc 取得所有文章
//@access Public
router.get("/",(req,res,next)=>{
    console.log('GET Request');
    res.json({message: 'It works!'});
});

//@router  GET api/posts/:postId
//@desc 取得文章資訊(單一)
router.get("/:postId", postController.getPost);

//@router PUT /api/posts/:postId
//@desc 更新文章
//@access Public
router.put("/:postId", (req,res,next)=>{
    res.json({message: 'It works!'});
});

//@router DELETE api/posts
//@desc 刪除文章
//@access Public*/
router.delete("/:postId", (req,res,next)=>{
    res.json({message: 'It works!'});
});


router.get('/', (req,res,next)=>{
    console.log('GET Request');
    res.json({message: 'It works!'});
})

module.exports =  router;