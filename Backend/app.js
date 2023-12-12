const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const sequelize = require('./util/sequelize');

const cors = require('cors');
app.use(cors());

app.use(express.json())//for handling json data
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));




const userRoute = require('./routes/signuproute');
app.use('/user', userRoute);

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