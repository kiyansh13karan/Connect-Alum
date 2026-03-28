import forumPostModel from "../models/ForumPost.js";
import { createNotification } from "./notificationController.js";

const createPost = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const authorId = req.userId;

        const newPost = new forumPostModel({ authorId, title, content, category });
        await newPost.save();

        res.json({ success: true, message: "Post created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) query.category = category;

        const posts = await forumPostModel.find(query)
            .populate("authorId", "name role")
            .sort({ createdAt: -1 });

        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const upvotePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.userId;

        const post = await forumPostModel.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const upvoteIndex = post.upvotes.indexOf(userId);
        if (upvoteIndex === -1) {
            post.upvotes.push(userId);
        } else {
            post.upvotes.splice(upvoteIndex, 1);
        }

        await post.save();

        if (post.authorId.toString() !== userId) {
            await createNotification(post.authorId, "forum", "Someone upvoted your post!", `/community`);
        }

        res.json({ success: true, upvotes: post.upvotes.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { postId, text } = req.body;
        const userId = req.userId;

        const post = await forumPostModel.findById(postId);
        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        post.comments.push({ userId, text });
        await post.save();

        if (post.authorId.toString() !== userId) {
            await createNotification(post.authorId, "forum", "Someone commented on your post.", `/community`);
        }

        res.json({ success: true, message: "Comment added" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { createPost, getPosts, upvotePost, addComment };
