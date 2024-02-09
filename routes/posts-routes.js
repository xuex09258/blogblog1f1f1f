const express = require('express');
const router = express.Router();
//const postController = require("../firstcontroller");
const postController = require("../controllers/postcontroller");
const auth = require("../middleware/auth"); //引入我們剛剛的auth middleware

//@router POST /api/posts
//@desc 新增文章
//@access Public
router.post("/", auth, postController.createPost); //在function中間加入auth

//@router GET api/posts/byTag
//@desc 取得所有文章(依照標籤分類)
//@access Public
router.get("/byTag", auth, postController.getPostsByTag);

//@router  GET api/posts
//@desc 取得所有文章
//@access Public
router.get("/", auth, postController.getAllPost);

//@router  GET api/posts/:postId
//@desc 取得文章資訊(單一)
router.get("/:postId", auth, postController.getPost);

//@router PUT /api/posts/:postId
//@desc 更新文章
//@access Public
router.put("/:postId", auth, postController.updatePost);

//@router DELETE api/posts
//@desc 刪除文章
//@access Public*/
router.delete("/:postId", auth, postController.deletePost);


router.get('/', (req,res,next)=>{
    console.log('GET Request');
    res.json({message: 'It works!'});
})

module.exports =  router;