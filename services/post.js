const Post = require('../models/post');
const User = require('../models/user');

const addPost = async(email, body, photo) => {
    const user = await User.findOne({ email });
    const post = new Post({user_email: email, user_firstName: user.firstName, user_lastName: user.lastName, user_photo: user.profilePhoto, postBody: body});
    if (photo) post.postPhoto = photo;
    return await post.save();
}


const getPosts = async () => {
    return await Post.find({}).sort({ publication_date: -1 });
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