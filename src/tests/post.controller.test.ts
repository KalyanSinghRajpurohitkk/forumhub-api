import { Request, Response } from "express";
import * as postController from "../presentation/controllers/post.controller";
import { Post } from "../infrastructure/models/post.model";

jest.mock("../infrastructure/models/post.model");

describe("Post Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: "user123", role: "user" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // CREATE POST
  it("should create a post", async () => {
    req.body = { title: "Test", content: "Content" };

    (Post.create as jest.Mock).mockResolvedValue(req.body);

    await postController.createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  // GET POSTS
  it("should get all posts", async () => {
    (Post.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });

    await postController.getPosts(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  // UPDATE SUCCESS
  it("should update post", async () => {
    req.params = { id: "1" };
    req.body = { title: "Updated" };

    const mockPost = {
      user: "user123",
      title: "Old",
      content: "Old",
      save: jest.fn(),
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.updatePost(req, res);

    expect(mockPost.save).toHaveBeenCalled();
  });

  // UPDATE NOT FOUND
  it("should return 404 if post not found", async () => {
    req.params = { id: "1" };

    (Post.findById as jest.Mock).mockResolvedValue(null);

    await postController.updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // UPDATE ACCESS DENIED
  it("should return 403 if not owner", async () => {
    req.params = { id: "1" };

    const mockPost = {
      user: "otherUser",
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  // DELETE SUCCESS
  it("should delete post", async () => {
    req.params = { id: "1" };

    const mockPost = {
      user: "user123",
      deleteOne: jest.fn(),
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.deletePost(req, res);

    expect(mockPost.deleteOne).toHaveBeenCalled();
  });

  // DELETE NOT FOUND
  it("should return 404 if delete post not found", async () => {
    req.params = { id: "1" };

    (Post.findById as jest.Mock).mockResolvedValue(null);

    await postController.deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // LIKE
  it("should like post", async () => {
    req.params = { id: "1" };

    const mockPost = {
      likes: [],
      save: jest.fn(),
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.likePost(req, res);

    expect(mockPost.likes.length).toBe(1);
  });

  // UNLIKE
  it("should unlike post", async () => {
    req.params = { id: "1" };

    const mockPost = {
      likes: ["user123"],
      save: jest.fn(),
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.likePost(req, res);

    expect(mockPost.likes.length).toBe(0);
  });

  // LIKE - POST NOT FOUND
  it("should return 404 if post not found for like", async () => {
    req.params = { id: "1" };

    (Post.findById as jest.Mock).mockResolvedValue(null);

    await postController.likePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // ADD COMMENT
  it("should add comment", async () => {
    req.params = { id: "1" };
    req.body = { text: "Nice" };

    const mockPost = {
      comments: [],
      save: jest.fn(),
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.addComment(req, res);

    expect(mockPost.comments.length).toBe(1);
  });

  // ADD COMMENT NOT FOUND
  it("should return 404 when post not found for comment", async () => {
    req.params = { id: "1" };

    (Post.findById as jest.Mock).mockResolvedValue(null);

    await postController.addComment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // DELETE COMMENT SUCCESS
  it("should delete comment", async () => {
    req.params = { postId: "1", commentId: "c1" };
    req.user = { id: "user123", role: "superuser" };

    const mockPost = {
      comments: [
        { _id: "c1", user: "user123" },
      ],
      save: jest.fn(),
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.deleteComment(req, res);

    expect(mockPost.comments.length).toBe(0);
  });

  // DELETE COMMENT NOT FOUND
  it("should return 404 if comment not found", async () => {
    req.params = { postId: "1", commentId: "c1" };

    const mockPost = {
      comments: [],
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.deleteComment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  // CREATE POST ERROR
it("should handle create post error", async () => {
  (Post.create as jest.Mock).mockRejectedValue("error");

  await postController.createPost(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
});

// GET POSTS ERROR
it("should handle get posts error", async () => {
  (Post.find as jest.Mock).mockImplementation(() => {
    throw new Error();
  });

  await postController.getPosts(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
});

  // DELETE COMMENT ACCESS DENIED
  it("should return 403 if not owner of comment", async () => {
    req.params = { postId: "1", commentId: "c1" };
    req.user = { id: "user123", role: "user" };

    const mockPost = {
      comments: [
        { _id: "c1", user: "otherUser" },
      ],
    };

    (Post.findById as jest.Mock).mockResolvedValue(mockPost);

    await postController.deleteComment(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});


