
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.Mongo_uri, {
      dbName:"Attendance"
    });

    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

module.exports = connectDB;
