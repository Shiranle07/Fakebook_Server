const postService = require("../services/post");
const jwt = require("jsonwebtoken");

const addPost= async(req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, "keyyy");
        // Now data contains the decoded token payload, including the email
        const userEmail = data.userEmail;
        res.json(await postService.addPost(userEmail, req.body.postBody, req.body.postPhoto));
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ errors: [error.message] });
    }
};

const getPosts= async(req, res) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Now data contains the decoded token payload, including the email
        const userEmail = data.userEmail;
        res.json(await postService.getPosts(userEmail));
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({ errors: ['Server error'] });
    }
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
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Now data contains the decoded token payload, including the email
        const userEmail = data.userEmail;
        // Call editPost service method with extracted email and other parameters
        const post = await postService.editPost(req.params.id, req.body.postBody, userEmail);

        // if(userEmail != req.params.id) return res.status(404).json({ errors: ['It is not your Post!'] });


        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }
        res.json(post);
    } catch (error) {
        console.error("Error editing post:", error);
        res.status(500).json({ errors: [error.message] });
    }
};


const deletePost = async (req, res) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Now data contains the decoded token payload, including the email
        const userEmail = data.userEmail;
        // Call deletePost service method with extracted email and other parameters
        const post = await postService.deletePost(req.params.id, userEmail);
        
        if(userEmail != req.body.user_email) return res.status(404).json({ errors: ['It is not your Post!'] });

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