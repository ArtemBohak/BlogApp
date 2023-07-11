import Post from "../models/Post.js";

export const create = async (req, res, next) => {
  try {
    const body = req.body;
    const doc = new Post({
      title: body.title,
      text: body.text,
      imageUrl: body.imageUrl,
      tags: body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Post not created" });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "-password").exec();
    return res.json({ posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
      },
      { $inc: { viewsCount: 1 } },
      {
        returnDocument: "after",
      }
    ).populate("user", "-password");
    if (!post) {
      return res.status(404).json({ message: "Such posts do not exist" });
    }
    return res.json({ post });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndRemove(postId);
    if (!post) {
      return res.status(404).json({ message: "Such posts do not exist" });
    }
    return res.json({ message: "The post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const update = async (req, res, next) => {
  try {
    const body = req.body;
    const postId = req.params.id;
    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { ...body },
      { returnDocument: "after" }
    ).populate("user", "-password");

    if (!post) {
      return res.status(404).json({ message: "Such posts do not exist" });
    }
    return res.json({ message: "The post updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
