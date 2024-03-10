const tokenService = require("../services/token");
const userService = require("../services/user");

const login = async (req, res) => {
    const user = await userService.authenticateUser(req.body.email, req.body.password);
    if (user) {
        const token = await tokenService.generateToken(user.email);
        res.status(201).json({ user, token });
    } else {
        res.status(404).send('Invalid username and/or password');
    }
};

module.exports = { login };
