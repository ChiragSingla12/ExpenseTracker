const express = require('express');

const router = express.Router();

const { addexpense, getexpenses, deleteExpense } = require('../controller/expenseController');

router
    .post('/addexpense', addexpense)
    .get('/getexpenses', getexpenses)
    .delete('/deleteexpense/:expenseid', deleteExpense);

module.exports = router;