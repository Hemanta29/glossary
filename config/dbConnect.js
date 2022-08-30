const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.PROD_MONGO_URI}`);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Error: , ${error.message}`);
        process.exit(1);
    }
};

module.exports = {
    dbConnect
}