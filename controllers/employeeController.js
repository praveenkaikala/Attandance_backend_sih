// controllers/employeeController.js
const cloudinary = require('../config/cloudinaryConfig');
const Employee = require('../models/employee')
const dotenv=require('dotenv')
const nodemailer = require('nodemailer');
dotenv.config()
function generatePassword(length) {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const allChars = lowerCase + upperCase + numbers;

  let password = "";
  const uniqueSet = new Set(); // Ensure uniqueness in each password generation

  while (password.length < length) {
    const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
    if (!uniqueSet.has(randomChar)) { // Check if character is unique
      password += randomChar;
      uniqueSet.add(randomChar);
    }
  }

  return password;
}

// Controller for creating a new employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, officeLocationId,phone } = req.body;
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists.' });
    }
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    });
    let photoUrl = null;
    // if (photo) {
    //   const result = await cloudinary.uploader.upload(photo, {
    //     folder: 'employees',
    //     width: 500,
    //     crop: 'scale',
    //   });
    //   photoUrl = result.secure_url; 
    // }
const password= generatePassword(8)
console.log(password)
    const employee = new Employee({
      name,
      photo: photoUrl, 
      email,
      role:"employee",
      officeLocationId,
      phone,
      managerId: req.manager ? req.manager._id : null,
      password
    });
    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: 'Account Created - Welcome to DECODERZ',
      text: `Hi ${name}, your account was successfully created. Your email is ${email} and your password is ${password}.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              background-color: #ffffff;
              padding: 20px;
              margin: 20px auto;
              max-width: 600px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              font-size: 24px;
              font-weight: bold;
              color: #4CAF50;
              margin-bottom: 10px;
            }
            .content {
              font-size: 16px;
              line-height: 1.6;
            }
            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #888;
              text-align: center;
            }
            .highlight {
              font-weight: bold;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Welcome, ${name}!</div>
            <div class="content">
              <p>We are excited to let you know that your account has been successfully created.</p>
              <p>Your login details are as follows:</p>
              <p>Email: <span class="highlight">${email}</span></p>
              <p>Password: <span class="highlight">${password}</span></p>
              <p>Please keep this information safe and secure.</p>
              <p>Keep up the great work!</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>Your Team at DECODERZ</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
   await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Error', error);
      } else {
        console.log('Email sent: ' + info.response);
       
      }
    })
    await employee.save();

    res.status(201).json({
      message: 'Employee created successfully.',
      employee,
    });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const createManager = async (req, res) => {
  try {
    const { name, email, officeLocationId,phone,password } = req.body;
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists.' });
    }
    let photoUrl = null;
    // if (photo) {
    //   const result = await cloudinary.uploader.upload(photo, {
    //     folder: 'employees',
    //     width: 500,
    //     crop: 'scale',
    //   });
    //   photoUrl = result.secure_url; 
    // }

    const employee = new Employee({
      name,
      photo: photoUrl, 
      email,
      role:"manager",
      officeLocationId,
      phone,
      managerId: null,
      password
    });

    await employee.save();

    res.status(201).json({
      message: 'Employee created successfully.',
      employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
const listManagers=async(req,res)=>{
  try {
    const managers=await Employee.find({role:"manager"})
    if(managers)
    {
      return res.status(200).send(managers)
    }
    return res.status(404).send({message:"not found"})
  } catch (error) {
    return res.status(500).send({message:"internal server error"})
    console.log(error)
  }
}
module.exports = {
  createEmployee,
  createManager,
  listManagers
};
