// controllers/employeeController.js
const cloudinary = require('../config/cloudinaryConfig');
const Employee = require('../models/employee')
function generatePassword(length) {
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  const allChars = lowerCase + upperCase + numbers + specialChars;

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
    const employee = new Employee({
      name,
      photo: photoUrl, 
      email,
      role:"employee",
      officeLocationId,
      phone,
      managerId: req.manager ? req.manager._id : null,
    password:"admin123"
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
module.exports = {
  createEmployee,
  createManager
};
