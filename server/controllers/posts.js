import Post from "../models/Post.js";
import User from "../models/user.js";
import Comment from "../models/Comment.js";
// CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({
      message: err.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const { postId } = req.params;

    const curPost = await Post.findById(postId);
    const curUser = await User.findById(userId);

    const newComment = new Comment({
      userId,
      firstName: curUser.firstName,
      lastName: curUser.lastName,
      description,
      picturePath: curUser.picturePath,
    });

    const comments = curPost.comment;
    comments.push(newComment);

    await Post.findByIdAndUpdate(postId, { comment: comments });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

//READ
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};
export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const curPost = await Post.findById(postId);

    res.statuc(200).json(curPost);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

//UPDATE
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};
