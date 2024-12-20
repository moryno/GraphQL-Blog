import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";

export default {
  register: async function (args, req) {
    const {
      userInput: { email, password, name },
    } = args;

    const errors = [];

    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is invalid." });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password is too short." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid credentials.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        const error = new Error("User already exist.");
        throw error;
      }

      const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        name,
        password: hashedPw,
      });

      const newUser = await user.save();

      return {
        ...newUser._doc,
        _id: newUser._id.toString(),
      };
    } catch (error) {
      console.error(error);
      throw new Error("Registration failed. Please try again.");
    }
  },
  login: async function ({ email, password }, req) {
    const errors = [];

    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is invalid." });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password is too short." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid credentials.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    try {
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("User not found.");
        error.code = 401;
        throw error;
      }

      const passMatch = await bcrypt.compare(password, user.password);
      if (!passMatch) {
        const error = new Error("You have entered wrong password.");
        error.code = 404;
        throw error;
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );

      return {
        userId: user._id.toString(),
        token,
        name: user.name,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Login failed. Please try again.");
    }
  },
  createPost: async function (
    { postInput: { title, content, imageUrl } },
    req
  ) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const errors = [];
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 3 })) {
      errors.push({ title: "Title is invalid." });
    }
    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ content: "Content is invalid." });
    }
    if (validator.isEmpty(imageUrl)) {
      errors.push({ image: "Image is required." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error("User not found.");
        error.code = 404;
        throw error;
      }

      const postExist = await Post.findOne({ title });

      if (postExist) {
        const error = new Error("Post exists already");
        throw error;
      }

      const post = new Post({
        title,
        content,
        imageUrl,
        author: user,
      });
      const createdPost = await post.save();
      user.posts.push(post);
      await user.save();

      return {
        ...createdPost._doc,
        _id: createdPost._id.toString(),
        createdAt: createdPost.createdAt.toISOString(),
        updatedAt: createdPost.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error(error);
      throw new Error("Creating post failed. Please try again.");
    }
  },
  posts: async function (args, req) {
    try {
      if (!req.isAuth) {
        const error = new Error("Not authenticated!");
        error.code = 401;
        throw error;
      }

      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("author");

      return posts.map((post) => ({
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      }));
    } catch (error) {}
  },
  post: async function ({ id }, req) {
    try {
      if (!req.isAuth) {
        const error = new Error("Not authenticated!");
        error.code = 401;
        throw error;
      }

      const post = await Post.findById(id).populate("author");

      if (!post) {
        const error = new Error("Post not found");
        error.code = 404;
        throw error;
      }

      return {
        ...post._doc,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      };
    } catch (error) {}
  },
  deletePost: async function ({ id }, req) {
    try {
      if (!req.isAuth) {
        const error = new Error("Not authenticated!");
        error.code = 401;
        throw error;
      }

      const post = await Post.findById(id);
      if (!post) {
        const error = new Error("Post not found");
        error.code = 404;
        throw error;
      }
      await Post.deleteOne({ _id: id });

      return "Post has been deleted.";
    } catch (error) {}
  },
  updatePost: async function (
    { id, postInput: { title, content, imageUrl } },
    req
  ) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const errors = [];
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 3 })) {
      errors.push({ title: "Title is invalid." });
    }
    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ content: "Content is invalid." });
    }
    if (validator.isEmpty(imageUrl)) {
      errors.push({ image: "Image is required." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const post = await Post.findById(id).populate("author");

      if (!post) {
        const error = new Error("Post not found");
        error.code = 404;
        throw error;
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      const updatedPost = await post.save();

      return {
        ...updatedPost._doc,
        _id: updatedPost._id.toString(),
        createdAt: updatedPost.createdAt.toISOString(),
        updatedAt: updatedPost.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error(error);
      throw new Error("Update post failed. Please try again.");
    }
  },
};
