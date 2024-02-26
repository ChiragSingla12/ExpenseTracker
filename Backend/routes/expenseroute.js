const express = require('express');

const expenseController = require('../controller/expenseController')
const userauthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addexpense', userauthentication.authenticate,  expenseController.addexpense )

router.get('/download', userauthentication.authenticate, expenseController.downloadexpense);

router.get('/getexpenses', userauthentication.authenticate ,  expenseController.getexpenses )

router.delete('/deleteexpense/:expenseid', userauthentication.authenticate , expenseController.deleteExpense)

module.exports = router;

// const express = require('express');

// const router = express.Router();

// const { addexpense, getexpenses, deleteExpense } = require('../controller/expenseController');

// router
//     .post('/addexpense', addexpense)
//     .get('/getexpenses', getexpenses)
//     .delete('/deleteexpense/:expenseid', deleteExpense);

// module.exports = router;