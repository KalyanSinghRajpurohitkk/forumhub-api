import { Request, Response } from "express";
import { User } from "../../infrastructure/models/user.model";
import { Post } from "../../infrastructure/models/post.model";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();

    // count number of total comments
    const posts = await Post.find();
    let totalComments = 0;

    posts.forEach((post) => {
      totalComments += post.comments.length;
    });

    // count number of total like 
    let totalLikes = 0;
    posts.forEach((post) => {
      totalLikes += post.likes.length;
    });

    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};