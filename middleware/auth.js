const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {

    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.TOKEN_SECRET);

        // const id =user.userId

        User.findByPk(user.userId).then(user => {
            req.user = user; ///ver
            next();
        })

      } catch(err) {
        console.log(err);
        return res.status(401).send({'success': false})
        // err
      }
}
module.exports = {
    authenticate
}