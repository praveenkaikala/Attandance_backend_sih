
const express = require('express');
const { createEmployee, createManager } = require('../controllers/employeeController');
const upload = require('../middleware/uploadPhoto');
const validateManagerId = require('../middleware/validateManager');
const router = express.Router();
router.post('/createemployee',validateManagerId,createEmployee);
router.post('/createmanager',createManager);
module.exports = router;
