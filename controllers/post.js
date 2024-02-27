const postService = require("../services/post");

const addPost= async(req, res) => {
    res.json(await postService.addPost(req.body.postBody, req.body.postPhoto));
};

module.exports = {addPost};