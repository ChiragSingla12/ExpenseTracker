const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const sequelize = require('./util/sequelize');
const Order = require('./models/orders');
const dotenv = require('dotenv');

const cors = require('cors');
const jwt = require('jsonwebtoken');
app.use(cors());

app.use(express.json())//for handling json data
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

const User = require('./models/user');
const Expense = require('./models/expenses');


const userRoute = require('./routes/signuproute');
const expenseRoute = require('./routes/expenseroute');
const purchaseRoutes = require('./routes/purchase');

app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync()
    .then(() => {//created schema in modal and sync with that
        // console.log(result)//CREATE TABLE IF NOT EXISTS `products` 
        app.listen(3000, (err) => {
            console.log("listening dynamic-routing at port 3000")
            // app.listen(3000);
        });
    })
    .catch((err) => {
        console.log(err)
    })