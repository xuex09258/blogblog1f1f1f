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