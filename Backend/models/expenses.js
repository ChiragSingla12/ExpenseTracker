const Sequelize = require('sequelize');
const sequelize = require('../util/sequelize');

//id, name , password, phone number, role

const Expense = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    expenseamount: Sequelize.INTEGER,
    category: Sequelize.STRING,
    description: Sequelize.STRING,
})

module.exports = Expense;