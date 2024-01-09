const User = require('../models/user');
const Expense = require('../models/expenses');
const sequelize = require('../util/sequelize');
const e = require('express');

//aggregate all th expenses based on the user id

const getUserLeaderBoard = async (req, res) => {
    try{
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {};
        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.expenseamount;
            }else{
                userAggregatedExpenses[expense.userId] = expense.expenseamount;
            }
        })
        var userLeaderBoardDetails = [];
        users.forEach((user) => {
                userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpenses[user.id] || 0})
        })
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}
// const getUserLeaderBoard = async (req, res) => {
//     try{
//         const leaderboardofusers = await User.findAll({
//             attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
//             include: [
//                 {
//                     model: Expense,
//                     attributes: []
//                 }
//             ],
//             group:['user.id'],
//             order:[['total_cost', 'DESC']]

//         })

//         res.status(200).json(leaderboardofusers)

// } catch (err){
//     console.log(err)
//     res.status(500).json(err)
// }
// }

module.exports = {
    getUserLeaderBoard
}