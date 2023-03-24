const { verify } = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const decodedToken = verify(token, process.env.SECRET_KEY);
            const userId = decodedToken.userId;
            if (userId) {
                throw new Error('Invalid user ID');
            } else {
                next();
            }
        } else {
            res.send('token is not found');
        }
    } catch (e) {
        res.send(`Désolé votre token est expirer!`);
    }
};