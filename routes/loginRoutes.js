const express = require('express');
const {
 loginController,loginUserController
} = require('../controllers/loginControllers');

const router = express.Router();


router.post('/', loginController);
router.post('/employee',loginUserController)
module.exports = router;
