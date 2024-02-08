const mongoose  = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async() =>{
    try{
        await mongoose.connect(db);
        console.log('MongoDB Connected ok 0208...');
        
    } catch(err){   
        console.error(err.message);

        //當失敗的時候立刻離開此程式
        process.exit(1);
    }
}

module.exports = connectDB;