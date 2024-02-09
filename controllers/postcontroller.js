//const HttpError = require('../models/http-error');
const Post = require('../models/Post');

const MOCK_POSTS = [
    {
        id: 'p1',
        title: '文章1',
        tags:['chatGPT'],
        content:'ChatGPT'
    },
    {
        id: 'p2',
        title: '文章2',
        tags:['frontend'],
        content:'Micro frontend'
        
    }
]

//取得所有文章(依照標籤分類)
exports.getPostsByTag =  async (req,res,next) =>{
  try {
       const results = await Post.aggregate([
             // 使用 $unwind 來擴展 tags這個陣列
             {
                 $unwind: "$tags"
             },
             //根據tag來組合回傳的資料
             {
                 $group: {
                     _id: "$tags", // 使用 tag 作為群組的 ID
                     posts: {
                         $push: {
                             title: "$title",
                             content: "$content",
                             tags: "$tags",
                             authorId: "$authorId",
                             createdDate: "$createdDate",
                         }
                     }
                 }
             },
             //根據文章建立時間排序
             {
                 $sort: { "posts.createdDate": -1 }
             },
             // 調整回傳資料
             {
                 $project: {
                     tag: "$_id",
                     posts: 1, //保留posts。數字1代表該欄位被包含在回傳資料中。
                     _id: 0  // 將_id從回傳內容中排除。因為每個MongoDB文件都會有一個自動生成的_id，但在這裡我們不希望它出現在回傳的資料中
                 }
             }
         ]);
 
         res.json(results);
         
     } catch (err) {
         next(new HttpError('Server error', 500));
     }
 } 

//取得所有文章
exports.getAllPost =  async (req,res,next) =>{
  try {
      const { tag, title } = req.query;

      let queryObj = {};

      //若有tag參數
      if (tag) {
         queryObj.tags = { $regex: new RegExp(tag, 'i') }; // 使用正規表達式進行模糊搜尋
      }

      //若有title參數
      if (title) {
          queryObj.title = new RegExp(title, 'i'); // 使用正規表達式進行模糊搜尋
      }

      const posts = await Post.find(queryObj);
      
      res.json(posts);

  } catch (err) {
      next(new HttpError('Server error', 500));
  }
}

//@router  GET api/posts/:postId
//@desc 取得文章資訊(單一)
//取得文章資料
exports.getPost = async (req, res, next) => {
    try {
      //取得文章的資料和作者
      const post = await Post.findById(req.params.postId).populate('author', 'fullName profileImage _id');
  
      if (!post) return next(new HttpError("Post not found", 404));
      
      res.json(post);
  
    } catch (error) {
      next(new HttpError("Server error", 500));
    }
  };
  

//建立文章
const createPost =  async (req,res,next) =>{
    try {
        const { title, tags, content, authorId } = req.body;

        if (!title || title.trim() === "") {
            return next(new HttpError('Title is required', 400));
        }
        
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return next(new HttpError('Tags should be an array and cannot be empty', 400));
        }
        
        if (!content || content.trim() === "") {
            return next(new HttpError('Content is required', 400));
        }

        const post = new Post({
            title,
            tags,
            content,
            authorId,
        });
  
        await post.save();

        res.status(201).json(post);

    } catch (error) {
        next(new HttpError('伺服器錯誤', 500));
    }
}
// 更新文章
exports.updatePost = async (req, res, next) => {
    try {
      const { postId } = req.params; 
  
      if (!postId) {
        return next(new HttpError("PostId is required", 400));
      }
  
      const { title, tags, content, coverImage, authorId } = req.body;
  
      // 檢查文章是否存在
      const post = await Post.findById(postId);
      if (!post) {
        return next(new HttpError("Post not found", 404));
      }
  
      // 更新文章資料
      if (title && title.trim() !== "") {
        post.title = title;
      }
  
      if (tags && Array.isArray(tags) && tags.length !== 0) {
        post.tags = tags;
      }
  
      if (content && content.trim() !== "") {
        post.content = content;
      }
  
      if (coverImage) {
        post.coverImage = coverImage;
      }
  
      await post.save();
  
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      next(new HttpError("Server error", 500));
    }
  };
  //刪除
  exports.deletePost =  async (req,res,next) =>{
    try {
        const post = await Post.findById(req.params.postId);
  
        if (!post) return next(new HttpError('刪除失敗:此id的文章不存在', 404));
  
        await post.deleteOne();
  
        res.json({ message: '刪除成功' });
  
    } catch (error) {
        next(new HttpError('伺服器錯誤', 500));
    }
} 

exports.createPost = createPost;