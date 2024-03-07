const Post = require('../models/post');

const addPost = async(body, photo) => {
    const post = new Post({postBody: body, time: time});
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