
const Employee = require('../models/employee'); 

const validateManagerId = async (req, res, next) => {
  try {
    const { managerId } = req.body;

    if (managerId) {
      
      const manager = await Employee.findById(managerId);

      if (!manager) {
        return res.status(404).json({ message: 'Manager not found.' });
      }
      req.manager = manager;
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = validateManagerId;
