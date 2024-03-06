const Post = require('../models/post');

const addPost = async(body, photo) => {
    const post = new Post({postBody: body});
    if (photo) post.postPhoto = photo;
    return await post.save();
}

module.exports = {addPost};