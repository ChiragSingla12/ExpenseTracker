const Expense = require('../models/expenses');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sequelize = require('../util/sequelize');
const UserServices = require('../services/userservices');
const S3service = require('../services/S3services')
const AWS = require('aws-sdk');


function uploadToS3(data, filename) {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }


    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong', err)
                reject(err);
            } else {
                console.log('success', s3response);
                resolve(s3response.Location);
            }
        })
    })

}


const downloadexpense = async (req, res) => {
    try{
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);

        //it should depend upon the userid
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3service.uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({ fileURL, success: true });
    }catch(err){
        console.log(err);
        res.status(500).json({ fileURL:'', 'success': false, err: err });
    }

}



const addexpense = async (req, res) => {
    const t = await sequelize.transaction(); // kind of object
    try {
        const { expenseamount, description, category } = req.body;

        if (expenseamount == undefined || expenseamount.length === 0) {
            return res.status(400).send({ 'success': false, 'message': 'parameters missing' });
        }

        const expense = await Expense.create({ expenseamount, description, category, userId: req.user.id }, { transaction: t })
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        })
        await t.commit();
        return res.status(200).json({ 'expense': expense })

    }
    catch (err) {
        console.log('err2', err)
        await t.rollback();
        return res.status(500).send({ 'success': false, 'error': err })
    }
}

const getexpenses = (req, res) => {
    Expense.findAll({ where: { userId: req.user.id } }).then(expense => {
        return res.status(200).send({ 'data': expense, 'success': true });
    }).catch(err => {
        return res.status(400).send({ 'error': err, 'success': true });
    })
}


const deleteExpense = async (req, res) => {
    const t = await sequelize.transaction(); // kind of object
    try {
        const expenseid = req.params.expenseid;
        const deleteexpense = await Expense.destroy({ where: { id: expenseid, userId: req.user.id } }, { transaction: t })
        const totalExpense = Number(req.user.totalExpenses) - Number(deleteexpense.expenseamount);
        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: t
        })
        await t.commit();
        return res.status(200).json({ 'expense': deleteexpense, "success": true, "message": "Deleted Successfuly" })
    } catch (err) {
        console.log(err);
        return res.status(403).send({ "success": true, "message": "Failed" });
    }
}

module.exports = {
    getexpenses,
    deleteExpense,
    addexpense,
    downloadexpense
}