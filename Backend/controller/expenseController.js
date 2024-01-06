const Expense = require('../models/expenses');
const jwt = require('jsonwebtoken');

const addexpense = (req, res) => {
        const{ expenseamount, description, category } = req.body;

        if(expenseamount == undefined || expenseamount.length === 0){
            return res.status(400).send({'success': false, 'message': 'parameters missing'});
        }
        Expense.create({expenseamount, description, category,  userId: req.user.id}).then(expense => {
            return res.status(201).send({expense, 'success': true})
        }).catch(err => {
            return res.status(400).send({'success': false, 'error': err})
        })
}

const getexpenses = (req, res) => {
    Expense.findAll({ where : { userId: req.user.id}}).then(expense => {
        return res.status(200).send({'data':expense, "success": true});
    }).catch(err => {
        return res.status(400).send({'error': err, 'success': true});
    })
}


const deleteExpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where: { id: expenseid, userId: req.user.id }}).then((noofrows)=>{
        if(noofrows === 0){
            return res.status(404).send({"success": false, "message": 'Expense doenst belong to the user'})
        }
        return res.status(200).send({ "success": true, "message": "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).send({"success": true, "message": "Failed"});
    })
}

module.exports = {
    getexpenses,
    deleteExpense,
    addexpense
}