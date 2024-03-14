const Post = require('../models/post');
const User = require('../models/user');

const addPost = async(email, body, photo) => {
    const user = await User.findOne({ email });
    const post = new Post({user_email: email, user_firstName: user.firstName, user_lastName: user.lastName, user_photo: user.profilePhoto, postBody: body});
    if (photo) post.postPhoto = photo;
    return await post.save();
}

// 20 last posts of the users friends and 5 more posts from non-friends of the user
const getPosts = async (userEmail) => {
    try {
        // Get the user's friends
        const user = await User.findById(userEmail).populate('friends');
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

module.exports = {addPost, getPosts, getPostById, deletePost, editPost};