const mongoose = require('mongoose');

// Allow Mongoose to be invoked globally 
mongoose.Promise = global.Promise;
let isConnected;

module.exports = connectToDatabase = () => {
    if (isConnected) {
        console.log('=> using existing database connection');
        return Promise.resolve();
    }
    const dbUrl = process.env.IS_OFFLINE ? process.env.DATABASE_TEST : process.env.DATABASE;
    console.log('=> using new database connection');
    return mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(db => {
            isConnected = db.connections[0].readyState;
        });
};