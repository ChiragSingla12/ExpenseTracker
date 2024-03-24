const express = require('express');

const resetpasswordController = require('../controller/resetpassword');


const router = express.Router();

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/reset-password/:id', resetpasswordController.resetpassword)

router.use('/forgot-password', resetpasswordController.forgotpassword)

module.exports = router;