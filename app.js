const express = require('express');

const dotenv = require('dotenv');
dotenv.config()

const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT;

const bodyParser = require('body-parser');
const cors = require('cors');
// const helmet = require('helmet');
const morgan = require('morgan');

const sequelize = require('./util/sequelize');


const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');


const userRoute = require('./routes/signuproute');
const expenseRoute = require('./routes/expenseroute');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const resetPasswordRoutes = require('./routes/resetpassword');
const pageRoutes = require('./routes/page');

const jwt = require('jsonwebtoken');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags : 'a'} // flag: a for appending not overwriting
);

// app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}));

app.use(cors());
app.use(express.json())//for handling json data
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(express.static('public'));

app.use(pageRoutes);
app.use('/user', userRoute);
app.use('/expense', expenseRoute);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

app.use((req, res) =>{
    res.sendFile(path.join(__dirname,`${req.url}`))
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


sequelize
    .sync()
    .then(() => {//created schema in modal and sync with that
        // console.log(result)//CREATE TABLE IF NOT EXISTS `products` 
        app.listen(PORT, (err) => {
            console.log("listening dynamic-routing at port 3000")
            // app.listen(3000);
        });
    })
    .catch((err) => {
        console.log(err)
    })