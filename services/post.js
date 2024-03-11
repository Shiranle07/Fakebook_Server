const Post = require('../models/post');
const User = require('../models/user');

const addPost = async(email, body, photo) => {
    const user = await User.findOne({ email });
    const post = new Post({user_firstName: user.firstName, user_lastName: user.lastName, postBody: body});
    if (photo) post.postPhoto = photo;
    return await post.save();
}


const getPosts = async() => {
   return await Post.find({});
}

const getPostById = async(id) => {
    return await Post.findById(id);
}

const editPost = async(id, postBody) => {
    const post = await getPostById(id);
    if (!post){
        return null;
    }
    post.postBody = postBody;
    await post.save();
    return post;
}

const deletePost = async(id) => {
    const post = await getPostById(id);
    if (!post){
        return null;
    }
    await post.deleteOne();
    return post;
};

module.exports = {addPost, getPosts, getPostById, deletePost, editPost};

