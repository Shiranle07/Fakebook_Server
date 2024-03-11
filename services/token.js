const Token = require('../models/token');
const jwt = require("jsonwebtoken");

const generateToken = async (userEmail) => {
    const token = jwt.sign({ userEmail }, "keyyy");
    // const newToken = new Token({ token, userEmail });
    // await newToken.save();
    return token;
}

const verifyToken = async (token) => {
    const existingToken = await Token.findOne({ token });
    return existingToken ? jwt.verify(token, key) : null;
};

module.exports = { generateToken, verifyToken };