const tokenService = require("../services/tokenService");
const userService = require("../services/userService");

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.authenticateUser(username, password);
    if (user) {
        const token = await tokenService.generateToken(user._id);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

module.exports = { login };
