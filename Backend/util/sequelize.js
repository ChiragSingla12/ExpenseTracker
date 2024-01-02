const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensetracker', 'root', 'Yash@2005', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;