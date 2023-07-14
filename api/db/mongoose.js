// This file will handle connection logic to the MongoDB database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/TaskManager', 
{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
    console.log("connected successfully");
}).catch((err) => {
    console.log('failed to connect');
    console.log(err);
});
// To prevent deprectation warnings (from MongoDB native driver)
//mongoose.set('useCreateIndex', true);
//mongoose.set('useFindAndModify', false);
//mongoose.connect('mongodb://127.0.0.1:27017/TaskManager', { useFindAndModify: false });
//mongoose.createConnection('mongodb://127.0.0.1:27017/TaskManager', { useNewUrlParser: true });
/* mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true); */



module.exports = {
    mongoose
}