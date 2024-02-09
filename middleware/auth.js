const jwt = require('jsonwebtoken');
const config = require('config');  //存取設置的私鑰

module.exports = function(req, res, next) {
    //從請求標頭中提取JWT（JSON Web Token）
    const bearerHeader =  req.header('Authorization');

    // 如果沒有則回傳錯誤
    if(!bearerHeader){
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    
    //檢驗憑證
    try{
        //判斷提供的憑證是否有效
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        // 將解析出來的使用者資訊加到請求上
        req.user = decoded.user; 
        // 轉到下一個middleware或路由處理程式
        next(); 
    }
    catch(err){
        res.status(401).json({msg: '無效的憑證'});
    }
}