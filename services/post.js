const Post = require('../models/post');
const User = require('../models/user');
const userService = require("../services/user");


const addPost = async(email, body, photo) => {
    const user = await User.findOne({ email });
    const post = new Post({user_email: email, user_firstName: user.firstName, user_lastName: user.lastName, user_photo: user.profilePhoto, postBody: body});
    if (photo) post.postPhoto = photo;
    return await post.save();
}

const getUserPosts = async (askingUser, askedUser) => {
    try {
        // Check if the asking user is in the asked user's friends list
        const askedUserDetails = await User.findById(askedUser);

        if (!askedUserDetails) {
            return null; // Asked user not found
        }

        // Check if the asking user is in the asked user's friends list
        const isFriend = askedUserDetails.friends.includes(askingUser);

        if (!isFriend || (askingUser != askedUser)) {
            return null; // The asking user is not a friend of the asked user
        }

        // Get the user's posts
        const userPosts = await Post.find({ user: userEmail })
                                    .sort({ publication_date: -1 });

        if (!friendList || !friendList.friends) {
            return null; // No friends found for the asked user
        }

        return userPosts.sort({ publication_date: -1 });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

const getPosts = async (userEmail) => {
    try {
        // Get the user's friends
        const user = await userService.getUserByEmail(userEmail).populate('friends');
        const friendsIds = user.friends.map(friend => friend._id);

        // Get the 20 latest posts from the user's friends
        const friendPosts = await Post.find({ user: { $in: friendsIds } })
                                        .sort({ publication_date: -1 })
                                        .limit(20);

        // Get the user's posts
        const userPosts = await Post.find({ user: userEmail })
                                    .sort({ publication_date: -1 });

        // Exclude the user's posts and posts from friends
        const nonFriendPosts = await Post.find({ user: { $nin: [...friendsIds, userEmail] } })
                                          .sort({ publication_date: -1 })
                                          .limit(5);

        // Combine all posts
        const posts = [...friendPosts, ...userPosts, ...nonFriendPosts];

        return posts.sort({ publication_date: -1 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};

const getPostById = async(id) => {
    return await Post.findById(id);
}

const editPost = async(id, postBody, email) => {
    const post = await getPostById(id);
    console.log("edited post:", post)
    if (!post){
        return null;
    }
    if (email == post.user_email){
    post.postBody = postBody;
    await post.save();
    return post;
    }

    return null;
}

const deletePost = async(id, email) => {
    const post = await getPostById(id);
    if (!post){
        return null;
    }
    if (email == post.user_email){
        await post.deleteOne();
        return post;
    }
    return null;

};

module.exports = {addPost, getPosts, getPostById, deletePost, editPost, getUserPosts};