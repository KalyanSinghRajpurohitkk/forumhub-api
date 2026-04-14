import { Request, Response } from "express";
import * as authController from "../presentation/controllers/auth.controller";
import { User } from "../infrastructure/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../infrastructure/models/user.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // REGISTER SUCCESS
  it("should register user", async () => {
    req.body = {
      username: "test",
      email: "test@gmail.com",
      password: "123",
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
    (User.create as jest.Mock).mockResolvedValue(req.body);

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  // REGISTER USER EXISTS
  it("should return 400 if user exists", async () => {
    req.body = { email: "test@gmail.com" };

    (User.findOne as jest.Mock).mockResolvedValue({});

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // REGISTER ERROR
  it("should handle register error", async () => {
    (User.findOne as jest.Mock).mockRejectedValue("error");

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  // LOGIN SUCCESS
  it("should login user", async () => {
    req.body = { email: "test", password: "123" };

    (User.findOne as jest.Mock).mockResolvedValue({
      _id: "1",
      password: "hashed",
      role: "user",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token");

    await authController.login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: "token" });
  });

  // LOGIN USER NOT FOUND
  it("should return 400 if user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // LOGIN WRONG PASSWORD
  it("should return 400 if password incorrect", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      password: "hashed",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // LOGIN ERROR
  it("should handle login error", async () => {
    (User.findOne as jest.Mock).mockRejectedValue("error");

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});