const token = require("../services/token");
const user = require("../services/user");

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await user.authenticateUser(username, password);
    if (user) {
        const token = await token.generateToken(user._id);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

module.exports = { login };
