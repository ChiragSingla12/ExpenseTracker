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
        res.status(201).json({message: 'Successfully create new user'});
    }
    catch (err) {
        res.status(500).json({ error: err });
    }

}