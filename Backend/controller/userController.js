const User = require('../models/user');

exports.signup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        // const { name, phoneNumber, email } = req.body;

        if (name == undefined || name.length === 0 || email == undefined || email.length === 0 || password == undefined || password.length === 0) {
            return res.status(400).json({ err: "Bad Parameters: something is missing" })
        }
        const data = await User.create(
            {
                name: name,
                email: email,
                password: password
            });
        // const data = await User.create({ name, phone, email });
        // console.log(data);
        res.status(201).json({ message: 'Successfully create new user' });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }

}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            // If user exists, check if the password matches
            if (password === existingUser.password) {
                res.json({ status: 'success', message: 'User login successful!' });
            } else {
                res.status(401).json({ status: 'unauthorized', message: 'Password does not match!' });
            }
        } else {
            // User does not exist, send a 404 response
            res.status(404).json({ status: 'not_found', message: 'User not found!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(501).json({ status: 'error', error: 'Internal server error' });
    }
}