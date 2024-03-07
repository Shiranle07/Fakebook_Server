const Token = require('../models/token');

const generateToken = async (userId) => {
    const token = jwt.sign({ userId }, key);
    const newToken = new Token({ token, userId });
    await newToken.save();
    return token;
}

const verifyToken = async (token) => {
    const existingToken = await Token.findOne({ token });
    return existingToken ? jwt.verify(token, key) : null;
};

module.exports = { generateToken, verifyToken };
