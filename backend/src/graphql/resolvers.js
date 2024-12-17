import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import jwt from "jsonwebtoken";

export default {
  register: async function (args, req) {
    const { userInput } = args;
    try {
      const existingUser = await User.findOne({ email: userInput.email });

      if (existingUser) {
        const error = new Error("User already exist.");
        throw error;
      }

      const hashedPw = await bcrypt.hash(userInput.password, 12);
      const user = new User({
        email: userInput.email,
        name: userInput.name,
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
  },
  createPost: async function (
    { postInput: { title, content, imageUrl } },
    req
  ) {
    try {
      const postExist = await Post.findOne({ title });

      if (postExist) {
        const error = new Error("Post exists already");
        throw error;
      }

      const post = new Post({
        title,
        content,
        imageUrl,
        author: {
          _id: "6732f59ecbe6686ccc9891b6",
        },
      });
      const createdPost = await post.save();
      // TO DO
      // Add post to users post

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
      // TO DO
      // Check if user is authenticated

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
      // TO DO
      // Check if user is authenticated

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
      // Check if user is authenticated
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
