const express = require('express');
const { checkIn, checkOut } = require('../controllers/attendanceController');
const router=express.Router()

router.post('/checkin',checkIn)
router.post('/checkout',checkOut)

module.exports = router;