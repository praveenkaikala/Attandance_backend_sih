
const cloudinary = require('cloudinary').v2;
const dotenv=require('dotenv')
dotenv.config()
cloudinary.config({
  cloud_name:process.env.Cloud_name,
  api_key: process.env.Cloud_api_key,
  api_secret: process.env.Cloud_api_secret,
});

module.exports = cloudinary;
