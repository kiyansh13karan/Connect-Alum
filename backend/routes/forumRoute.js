import express from "express";
import { createPost, getPosts, upvotePost, addComment } from "../controllers/forumController.js";
import authMiddleware from "../middleware/auth.js";

const forumRouter = express.Router();

forumRouter.post("/create", authMiddleware, createPost);
forumRouter.get("/", getPosts);
forumRouter.post("/upvote", authMiddleware, upvotePost);
forumRouter.post("/comment", authMiddleware, addComment);

export default forumRouter;
