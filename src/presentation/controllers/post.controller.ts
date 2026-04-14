import { Request, Response } from "express";
import { Post } from "../../infrastructure/models/post.model";
import { logger } from "../../config/logger";

// CREATE POST
export const createPost = async (req: any, res: Response) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      user: req.user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL POSTS
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("user", "username email");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE POST
export const updatePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // CHECK OWNER OR SUPERUSER
    if (
      post.user.toString() !== req.user.id &&
      req.user.role !== "superuser"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE POST
export const deletePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // CHECK OWNER OR SUPERUSER
    if (
      post.user.toString() !== req.user.id &&
      req.user.role !== "superuser"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LIKE / UNLIKE POST
export const likePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    // CHECK IF ALREADY LIKED
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // UNLIKE
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // LIKE
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ADD COMMENT
export const addComment = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text,
    };

    post.comments.push(newComment);

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE COMMENT
export const deleteComment = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

const comment = post.comments.find(
  (c: any) => c._id.toString() === req.params.commentId
);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // OWNER OR ADMIN
    if (
      comment.user.toString() !== req.user.id &&
      req.user.role !== "superuser"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

post.comments = post.comments.filter(
  (c: any) => c._id.toString() !== req.params.commentId
);

    await post.save();

    res.json({ message: "Comment deleted" });
  } catch (error) {
      logger.error(error);
    res.status(500).json({ message: "Server error" });
  }
};