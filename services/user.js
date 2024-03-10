const User = require('../models/user');
const bcrypt = require('bcrypt');


const addUser = async(firstName, lastName, email, password, photo) => {
    const check = await User.findOne({email});
    if(!check){
        const user = new User({firstName : firstName, lastName : lastName,
            email : email, password : password});
        if (photo) user.profilePhoto = photo;
        return await user.save();
    }
    else return null;

}

const authenticateUser = async (email, password) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return null; // User not found
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return null; // Password doesn't match
    }

    // Return the authenticated user
    return user;
};

module.exports = { addUser, authenticateUser };
