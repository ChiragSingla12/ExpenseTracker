const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'Yash@2005', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;