const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  tags: {
    type: Array,
    required: true
  },
  content: { 
    type: String, 
    required: true 
  },
  //文章發布日期
  createdDate: {
    type: Date,
    default: Date.now
  },
  //文章作者Id
  authorId:{
    type: String, 
    required: true 
  }
});

module.exports = Post = mongoose.model('Post', PostSchema);
