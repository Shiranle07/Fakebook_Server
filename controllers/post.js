const postService = require("../services/post");

const addPost= async(req, res) => {
    res.json(await postService.addPost(req.body.postBody, req.body.postPhoto));
};

const getPosts= async(_, res) => {
    res.json(await postService.getPosts());
};

const getPostById= async(req, res) => {
    const post = await postService.getPostById(req.params.id);
    if (!post){
        return res.status(404).json({errors: {'Post not found'}});
    }
    res.json(post);
};

const editPost= async(req, res) => {
    try{
        const post = await postService.editPost(req.params.id, req.body.postBody);
        if (!post){
            return res.status(404).json({errors: {'Post not found'}});
        }
        res.json(post);
    }
    catch{
        return res.status(404).json({errors: {'Post not found'}});
    } 
};

const deletePost= async(req, res) => {
    try{
        const post = await postService.deletePost(req.params.id, req.body.postBody);
        if (!post){
            return res.status(404).json({errors: {'Post not found'}});
        }
        res.json(post);
    }
    catch{
        return res.status(404).json({errors: {'Post not found'}});
    } 
};

module.exports = {addPost, getPosts, getPostById, editPost, deletePost};