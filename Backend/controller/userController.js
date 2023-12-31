const User = require('../models/user');

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

        const user = await User.findAll({ where: { email } });
        if (user.length > 0) {
            res.status(400).send({'message': 'User already exists' });
        } else {
            const data = await User.create(
                {
                    name: name,
                    email: email,
                    password: password
                });
            res.status(201).send({'message': 'User created successfully' });
        }

        // const data = await User.create({ name, phone, email });
        // console.log(data);
        // res.status(201).send({ message: 'Successfully create new user' });
    }
    catch (err) {
        console.log('err', err);
        res.status(400).send({ 'error': err, 'message': 'Something went wrong' });
    }

}


exports.login = async (req, res, next) => {
    const { email, password, user } = req.body;
    console.log(user);
    // console.log(req.body)
    try {
        const user = await User.findAll({ where: { email } });
        if (user.length > 0) {
            if (user[0].password === password) {
                res.status(200).send({ 'success': true, 'message': 'User logged in successfully!' });
            } else {
                res.status(400).send({ 'success': false, 'message': 'Password is incorrect' });
            }
        } else {
            res.status(404).send({ 'success': false, 'message': 'User does not exist' });
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({ 'success': false, 'message': 'something went wrong' });
    }
}
// exports.login = async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             // If user exists, check if the password matches
//             if (password === existingUser.password) {
//                 res.json({ status: 'success', message: 'User login successful!' });
//             } else {
//                 res.status(400).json({ status: 'unauthorized', message: 'Password does not match!' });
//             }
//         } else {
//             // User does not exist, send a 404 response
//             res.status(404).json({ status: 'not_found', message: 'User not found!' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(501).json({ status: 'error', error: 'Internal server error' });
//     }
// }