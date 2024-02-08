const config = require('config'); //引入剛剛設定的秘鑰位置
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const { check , validationResult }  =  require('express-validator'); 
const User = require('../models/User');
//const HttpError = require('../models/http-error');


const login = async(req, res, next) => {
    
    // 定義驗證規則
    const validationChains =  [
        // 檢查'email'欄位是否為有效的電子郵件格式
        check('email','請輸入有效的電子郵件').isEmail(),
        // 檢查'password'欄位是否存在
        check('password','密碼為必填欄位.').exists()
    ];

    // 執行上述的所有驗證規則
    await Promise.all(validationChains.map(validation => validation.run(req)));

    // 取得驗證結果
    const errors = validationResult(req);
    
    // 如果驗證結果有錯誤，則拋出400的HttpError
    if(!errors.isEmpty()){
        return next(new HttpError('驗證錯誤，請檢查輸入資料', 400));
    }

    const { email , password } = req.body;

    try {
        // 驗證使用者是否存在
        let user = await User.findOne({email});

        // 若使用者不存在，則拋出Error
        if(!user){
            return next(new HttpError('無效的資料，請檢查帳號密碼是否正確', 400));
        }

        // 驗證密碼是否匹配
        const isMatch = await bcrypt.compare(password, user.password);

        // 若密碼不匹配，則拋出400的HttpError
        if(!isMatch){
            return next(new HttpError('無效的資料，請檢查帳號密碼是否正確', 400));
        }
     
        // 建立要用於jsonwebtoken的資料模型
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        }

        // 生成jsonwebtoken
        jwt.sign(
            payload,
            config.get('jwtSecret'), //取得秘鑰
            {expiresIn: '12h'}, //設定token失效時間
            (err, token) => {
                if(err) throw err;
                // 將token回傳給客戶端
                res.json({ 
                    token, 
                });
            }
        )

    } catch (err) {
         if (!(err instanceof HttpError)) {
            console.error(err.message);
            err = new HttpError('Server error', 500);
        }
        next(err);
    }
}
//-------------------------------------------------------------
const registerUser = async(req, res, next) => {

    // 驗證規則設定
    const validationChains = [
        check('fullName', '姓名為必填欄位').not().isEmpty(),
        check('email', '請輸入有效的電子郵件').isEmail(),
        check('password', '請輸入6個字元以上的密碼').isLength({ min: 6 })
    ];

    // 執行所有的驗證規則
    await Promise.all(validationChains.map(validation => validation.run(req)));

    try {
        const errors = validationResult(req);

       // 若驗證錯誤，回傳錯誤
       if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: '註冊失敗',
                errors: errors.array()  // 這裡會回傳一個包含所有驗證錯誤的陣列
            });
        }


        const { fullName, email, password } = req.body;

        // 檢查該電子郵件是否已存在於資料庫中
        let user = await User.findOne({ email });
        if (user) {
            return next(new HttpError('User already exists.', 400));
        }

        user = new User({
            fullName,
            email,
            password
        });

        // 使用bcrypt對密碼進行加密
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 儲存新的使用者資訊至資料庫
        await user.save();

        //回傳註冊成功訊息
        res.status(200).json({ message: '註冊成功' })

    } catch (err) {
        // 根據錯誤的類型來決定如何處理
        if (err instanceof HttpError) {
            next(err);
        } else {
            console.error(err.message);
            next(new HttpError('Server error', 500));
        }
    }
};

exports.login = login;
exports.registerUser = registerUser;