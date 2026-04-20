import express from "express";
import { createPost } from "../controllers/post.controller";
import { protect } from "../../middlewares/auth.middleware";
import { getPosts } from "../controllers/post.controller";

import { updatePost, deletePost } from "../controllers/post.controller";

import { likePost } from "../controllers/post.controller";

import { addComment, deleteComment } from "../controllers/post.controller";



const router = express.Router();

// CREATE A NEW POST 
router.post("/", protect, createPost);

// GET ALL POSTS WHICH ARE THERE
router.get("/", getPosts);

// UPDATE POST
router.put("/:id", protect, updatePost);

// DELETE POST
router.delete("/:id", protect, deletePost);


// LIKE OR UNLIKE
router.put("/:id/like", protect, likePost);


// ADD COMMENT
router.post("/:id/comment", protect, addComment);

// DELETE COMMENT
router.delete("/:postId/comment/:commentId", protect, deleteComment);

export default router;