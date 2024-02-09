//const HttpError = require('../models/http-error');
const User = require('../models/User');  //記得引入User model
const Post = require('../models/Post');  //記得要引入post model

//取得該使用者發布的文章
exports.getUserPosts = async (req, res) => {
    try {
        //先判斷該User是否存在
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('找不到該使用者', 404)); 
        }
    
        const posts = await Post.find({ authorId: userId });

        res.json(posts);

    } catch (err) {
        next(new HttpError('Server error', 500));
    }
};

//取得使用者資料
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return next(new HttpError('查無此使用者', 404)); 
        }

        // 取得使用者資料(記得不可以回傳密碼)
        const userProfile = {
            fullName: user.fullName,
            email: user.email,
            joinDate: user.joinDate,
            bio: user.bio,
            profileImage: user.profileImage
        };

        res.json(userProfile);
        
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
};

//更新使用者資料
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { fullName, password, bio, profileImage } = req.body;
        const updatedData = {
            ...(fullName && { fullName }),
            ...(password && { password }),
            ...(bio && { bio }),
            ...(profileImage && { profileImage })
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return next(new HttpError('查無此使用者', 404)); 
        }

        const updatedProfile = {
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            joinDate: updatedUser.joinDate,
            bio: updatedUser.bio,
            profileImage: updatedUser.profileImage
        };

        res.json(updatedProfile);
        
    } catch (error) {
        next(new HttpError('Server error', 500));
    }
};