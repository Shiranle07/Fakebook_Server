const User = require('../models/user');

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

module.exports = {addUser};