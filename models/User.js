const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    //使用者姓名
    fullName:{
        type: String,
        required: true
    },
    //電子郵件，不可與其他人重複
    email:{
        type: String,
        required: true,
        unique: true
    },
    //密碼
    password: {
        type: String,
        required: true
    },
    //註冊日期
    joinDate: {
        type: Date,
        default: Date.now //使用預設值
    },
    //個人介紹
    bio: {
        type: String,
        default: ''  //使用空字串，註冊時不需要此欄位，當進入到使用者介面時才可以更新
    },
    //大頭貼
    profileImage: {
        type: String,
        default: ''  //使用空字串，註冊時不需要此欄位，當進入到使用者介面時才可以更新
    }
});

module.exports = User = mongoose.model('user',UserSchema);