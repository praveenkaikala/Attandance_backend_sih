// controllers/employeeController.js
const cloudinary = require('../config/cloudinaryConfig');
const Employee = require('../models/employee')

// Controller for creating a new employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, role, officeLocationId,phone,password } = req.body;
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
      role,
      officeLocationId,
      phone,
      managerId: req.manager ? req.manager._id : null,
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
};

module.exports = {
  createEmployee,
};
