const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const userSchema = require('./User.js');

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const Result = await User.updateMany(
        { gender: { $exists: false } },
        { $set: {gender: 'Other' } }
    );
    console.log(`Updated ${Result.modifiedCount} Users`);
        await mongoose.disconnect();
    })();