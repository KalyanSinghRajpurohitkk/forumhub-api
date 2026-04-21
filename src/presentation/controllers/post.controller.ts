import { Request, Response } from "express";
import { Post } from "../../infrastructure/models/post.model";
import { logger } from "../../config/logger";

// Create post
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

// Get all the posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("user", "username email");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update the post if u want
export const updatePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check who own or superuser as well
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

// Delete a post
export const deletePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check who own or superuser as well
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

// Like or unlike the post
export const likePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    // check if already liked or not
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // UNLIKE It
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // LIKE It
      post.likes.push(userId);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a comment
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

// Delete a comment
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

    // owner
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