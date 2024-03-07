const postService = require("../services/post");

const addPost= async(req, res) => {
    res.json(await postService.addPost(req.body.postBody, req.body.postPhoto));
};

const getPosts= async(_, res) => {
    res.json(await postService.getPosts());
};


const getPostById = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }
        res.json(post);
    } catch (error) {
        console.error("Error retrieving post:", error);
        res.status(500).json({ errors: ['Server error'] });
    }
};


const editPost = async (req, res) => {
    try {
        const post = await postService.editPost(req.params.id, req.body.postBody);
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }
        res.json(post);
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({ errors: ['Server error'] });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await postService.deletePost(req.params.id);
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }
        res.json(post);
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ errors: ['Server error'] });
    }
};


module.exports = {addPost, getPosts, getPostById, editPost, deletePost};