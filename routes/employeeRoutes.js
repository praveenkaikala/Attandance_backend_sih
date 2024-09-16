
const express = require('express');
const { createEmployee } = require('../controllers/employeeController');
const upload = require('../middleware/uploadPhoto');
const validateManagerId = require('../middleware/validateManager');
const router = express.Router();
router.post('/create',validateManagerId,createEmployee);

module.exports = router;
