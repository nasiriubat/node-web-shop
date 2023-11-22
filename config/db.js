require('dotenv').config();
const mongoose = require('mongoose');


const dbUrl = process.env.DB_URL;


function connectDB() {
    if (!mongoose.connection || mongoose.connection.readyState === 0) {
        // mongoose
        //     .connect(dbUrl)
        //     .then(() => {
        //         mongoose.connection.on('error', err => {
        //             console.error(err);
        //         });

        //         mongoose.connection.on('reconnectFailed', handleCriticalError);
        //     })
        //     .catch(handleCriticalError);

        mongoose.connect(dbUrl)
            .then(() => {
                mongoose.connection.on('error', err => {
                    console.error(err);
                });

                mongoose.connection.on('reconnectFailed', handleCriticalError);
            })
            .catch(handleCriticalError);
    }
}

function handleCriticalError(err) {
    console.error(err);
    throw err;
}

function disconnectDB() {
    mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };