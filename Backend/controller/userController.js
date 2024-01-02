const User = require('../models/user');
const bcrypt = require('bcrypt');

function isstringvalid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}
exports.signup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        // const { name, phoneNumber, email } = req.body;

        if (isstringvalid(name) || isstringvalid(email) || isstringvalid(password)) {
            return res.status(400).json({ err: "Bad Parameters: something is missing" })
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async(err, hash) => {
            const user = await User.findAll({ where: { email } });
            if (user.length > 0) {
                res.status(400).send({'message': 'User already exists' });
            } else {
                const data = await User.create(
                    {
                        name: name, email: email, password: hash
                    });
                res.status(201).send({'message': 'User created successfully' });
            }
        })
    }
    catch (err) {
        console.log('err', err);
        res.status(400).send({ 'error': err, 'message': 'Something went wrong' });
    }
}


exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findAll({ where: { email } });
        if (user.length > 0) {
           bcrypt.compare(password, user[0].password, (err, result) => {
            if(err){
                res.status(500).send({ 'success': false, 'message': 'Something went wrong' });
            }
            if(result){
                res.status(200).send({ 'success': true, 'message': 'User logged in successfully!' });
            }else {
            res.status(400).send({ 'success': false, 'message': 'Password is incorrect' });
            }
           })
        } else {
            res.status(404).send({ 'success': false, 'message': 'User does not exist' });
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ 'success': false, 'message': 'something went wrong' });
    }
}