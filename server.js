const express = require('express');

const mongoose =  require('mongoose');
const connectDB = require('./config/db');

const app = express();
const port = 5000;
const postRoutes = require('./routes/posts-routes');
const authRoutes = require('./routes/auth-routes');
const bodyParser = require('body-parser');
const users = require('./routes/users-routes'); //引入users-routes.js
const images = require('./routes/image-routes');

//連接到資料庫
connectDB();

app.use(bodyParser.json()); // 解析 JSON 

/**
 * 告訴 Express 提供在 uploads 目錄中的靜態檔案
 * 當瀏覽器或任何客戶端向 /uploads 發起請求時，它實際上是在請求伺服器的 uploads 目錄中的檔案。
 **/
app.use('/uploads', express.static('uploads'));


app.use('/api/auth', authRoutes); //引入我們的auth
app.use('/api/posts',postRoutes);
app.use('/api/users', users);
app.use('/api/images', images);

app.use((err, req, res, next) => {
  //檢查是否已經向客戶端發送了HTTP header，如果已經發送了，表示已經無法再修改狀態碼和header
 if (res.headersSent) {
     return next(err);
 }
 //將錯誤的堆疊訊息（stack trace）輸出到控制台，方便進行除錯
 console.error(err.stack);
 
 res.status(err.status || 500);
 
 res.json({
     error: {
         message: err.message  || 'Internal Server Error'
     }
 });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}); 