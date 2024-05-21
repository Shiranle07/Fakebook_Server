const Post = require('../models/post');
const User = require('../models/user');
const userService = require("./user");
const bloomService = require("./bloom");

function extractUrls(text) {
  const regex = /\b((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:[0-9]+)?(\/[^\s]*)?\b/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

const addPost = async (email, body, photo) => {

    const urls = extractUrls(body);
    if (urls.length > 0) {
        for (let i = 0; i < urls.length; i++) {
            console.log("checking url: " + urls[i]);
            const result = await bloomService.checkUrl(urls[i]);
            if (result) {
                console.log("url found in list: " + urls[i]);
                throw new Error("URL is blocked: " + urls[i]);
            }
            console.log("url is OK: " + urls[i]);
        }
    }


    const user = await User.findOne({ email });
    const post = new Post({ user_email: email, user_firstName: user.firstName, user_lastName: user.lastName, user_photo: user.profilePhoto, postBody: body });

    if (photo) post.postPhoto = photo;
    return await post.save();
}

const getUserPosts = async (askingUser, askedUser) => {
    try {
        // Check if the asking user is in the asked user's friends list
        console.log("got: ", askedUser)
        console.log("asker: ", askingUser)
        const askedUserDetails = await User.findOne({ email: askedUser });
        console.log("searching fot posts of: ", askedUserDetails)

        if (!askedUserDetails) {
            return null; // Asked user not found
        }

        // Check if the asking user is in the asked user's friends list
        const isFriend = askedUserDetails.friends.includes(askingUser);
        console.log("friendship:", isFriend)

        if (!isFriend && (askingUser != askedUser)) {
            console.log("not the same and not friends")
            return null; // The asking user is not a friend of the asked user
        }

        // Get the user's posts
        const userPosts = await Post.find({ user_email: askedUser })
            .sort({ publication_date: -1 });

        if (!userService.getFriendList(askingUser, askedUser)) {
            return null; // No friends found for the asked user
        }

        return userPosts;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

const getPosts = async (userEmail) => {
    try {
        // Get the user's friends
        const user = await userService.getUserByEmail(userEmail);
        const friendsIds = user.friends.map(friend => friend._id);
        
        let friendPosts = [];
        if (friendsIds.length > 0) {
            // Get the 20 latest posts from the user's friends
            friendPosts = await Post.find({ user: { $in: friendsIds } })
                .sort({ publication_date: -1 })
                .limit(20);
        }
        // Get the user's posts
        const userPosts = await Post.find({ user: userEmail })
            .sort({ publication_date: -1 })
            .limit(10);
        // Exclude the user's posts and posts from friends
        const nonFriendPosts = await Post.find({ user: { $nin: [...friendsIds, userEmail] } })
            .sort({ publication_date: -1 })
            .limit(5);
        // Combine all posts
        const posts = [...friendPosts, ...userPosts, ...nonFriendPosts];
        // Sort all posts by publication date in descending order
        posts.sort((a, b) => b.publication_date - a.publication_date);
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }

};


const getPostById = async (id) => {
    return await Post.findById(id);
}

const editPost = async (id, postBody, email) => {

    const urls = extractUrls(postBody);
    if (urls.length > 0) {
        for (let i = 0; i < urls.length; i++) {
            console.log("checking url: " + urls[i]);
            const result = await bloomService.checkUrl(urls[i]);
            if (result) {
                console.log("url found in list: " + urls[i]);
                throw new Error("URL is blocked: " + urls[i]);
            }
            console.log("url is OK: " + urls[i]);
        }
    }

    
    const post = await getPostById(id);
    console.log("edited post:", post)
    if (!post) {
        return null;
    }
    if (email == post.user_email) {
        post.postBody = postBody;
        await post.save();
        return post;
    }

    return null;
}

const deletePost = async (id, email) => {

    const post = await getPostById(id);
    if (!post) {
        return null;
    }
    if (email == post.user_email) {
        await post.deleteOne();
        return post;
    }
    return null;

};

module.exports = { addPost, getPosts, getPostById, deletePost, editPost, getUserPosts };