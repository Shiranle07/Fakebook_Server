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
    if (password == user.password) {
        return user; 
    }

    return null;
};

const getUser = async (email) => {
    console.log("email from server:", email)
    const user = await User.findOne({ email });
    console.log("user from server:", user)
    if(user){
        return user;
    }
    return null;
}

module.exports = { addUser, authenticateUser, getUser };