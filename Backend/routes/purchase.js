const express = require('express');

const purchaseController = require('../controller/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premium-membership', authenticatemiddleware.authenticate, purchaseController.purchasepremium);

router.post('/updatetransactionstatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

module.exports = router;