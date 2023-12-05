const User = require('../model/user');

exports.signup = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        // const { name, phoneNumber, email } = req.body;

        const data = await User.create(
            {
                name: name,
                email: email,
                password: password
            });
        // const data = await User.create({ name, phone, email });
        console.log(data);
        res.status(201).json({ newUserDetail: data });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }

}