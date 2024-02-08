const express = require('express');

const mongoose =  require('mongoose');
const connectDB = require('./config/db');

const app = express();
const port = 5000;
const postRoutes = require('./routes/posts-routes');
const authRoutes = require('./routes/auth-routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // 解析 JSON 

//連接到資料庫
connectDB();

app.use('/api/auth', authRoutes); //引入我們的auth
app.use('/api/posts',postRoutes);

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