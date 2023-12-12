const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');

router.post('/Signup', userController.signup);

module.exports = router;