const postService = require("../services/post");
const userService = require("../services/user");
const jwt = require("jsonwebtoken");

const addPost= async(req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, "keyyy");
    res.json(await postService.addPost(data.userEmail, req.body.postBody, req.body.postPhoto));
};

const getUserPosts = async (req, res) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Get the user's ID from the request parameters
        const userId = req.params.id;
        // Call the service to retrieve the userPosts
        const userPosts = await postService.getUserPosts(data.userEmail, userId);

        if (!userPosts) {
            return res.status(404).json({ error: 'Limited access to user Posts' });
        }

        // Return the userPosts
        res.json({ userPosts });
    } catch (error) {
        console.error('Error fetching user Posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPosts= async(req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, "keyyy");
    res.json(await postService.getPosts(data.userEmail));
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
        console.log("user requested:", userEmail)
        // Call editPost service method with extracted email and other parameters
        const post = await postService.editPost(req.params.id, req.body.postBody, userEmail);

        if(userEmail != req.params.id) return res.status(404).json({ errors: ['It is not your Post!'] });

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
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Now data contains the decoded token payload, including the email
        const userEmail = data.userEmail;
        // Call deletePost service method with extracted email and other parameters
        const post = await postService.deletePost(req.params.id, userEmail);
        if (!post) {
            return res.status(404).json({ errors: ["You can't delete someone else's post!"] });
        }
        res.json(post);
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({ errors: ['Server error'] });
        }
};

module.exports = {addPost, getPosts, getPostById, editPost, deletePost, getUserPosts};