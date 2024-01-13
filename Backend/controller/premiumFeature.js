const User = require('../models/user');
const Expense = require('../models/expenses');
const sequelize = require('../util/sequelize');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardofusers = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        })

        res.status(200).json(leaderboardofusers)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
//aggregate all th expenses based on the user id

// const getUserLeaderBoard = async (req, res) => {
//     try{
//         const users = await User.findAll({
//             attributes: ['id', 'name']
//         })
//         const userAggregatedExpenses = await Expense.findAll({
//             attributes: ['userId', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost']],
//             group: ['userID']
//         });

//         var userLeaderBoardDetails = [];
//         users.forEach((user) => {
//                 userLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpenses[user.id] || 0})
//         })
//         console.log(userLeaderBoardDetails);
//         userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
//         res.status(200).json(userAggregatedExpenses);
//     }catch(err){
//         console.log(err);
//         res.status(500).json(err);
//     }
// }

module.exports = {
    getUserLeaderBoard
}