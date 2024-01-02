const Expense = require('../models/expenses');

exports.addexpense = (req, res) => {
        const{ expenseamount, description, category } = req.body;

        if(expenseamount == undefined || expenseamount.length === 0){
            return res.status(400).send({success: false, message: 'parameters missing'});
        }
        Expense.create({expenseamount, description, category}).then(expense => {
            return res.status(201).send({expense, success: true})
        }).catch(err => {
            return res.status(400).send({success: false, error: err})
        })
}

exports.getexpenses = (req, res) => {
    Expense.findAll().then(expense => {
        return res.status(200).send({'data':expense, "success": true});
    }).catch(err => {
        return res.status(400).send({error: err, success: true});
    })
}



exports.deleteExpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where: {id: expenseid}}).then(()=>{
        return res.status(200).send({success: true, message: 'Deleted Successfully'})
    }).catch(err => {
        console.log(err);
        return res.status(403).send({success: true, message: "Failed"});
    })
}