//const HttpError = require('../models/http-error');
const config = require('config');

//圖片上傳
exports.uploadImage = (req, res, next) => {
    if (!req.file) {
        const error = new HttpError('沒有檔案被上傳', 400);
        return next(error);
    }
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ success: true, data: { url: imageUrl } });
};

//圖片檔案格式和大小判斷
exports.uploadErrorHandler = (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_TYPES") {
        res.status(422).json({ error: "只支援jpg、jpeg、png" });
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: `檔案過大，最大為 ${config.get('fileMaxSize')} / 1000000}MB` });
        return;
    }
    next(err);
};