import jwt from "jsonwebtoken";
import "dotenv/config.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY;

export const register = async (req, res) => {
  try {
    if (await User.findOne({ email: req.body.email })) {
      return res
        .status(409)
        .json({ message: "The account with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const doc = new User({
      email: req.body.email,
      password: hashedPassword,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    });
    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.set();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: true,
      sameSite: true,
    });
    res.json({ message: "Registered" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "Email or password is invalid" });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Email or password is invalid" });
    }

    const token = jwt.sign({ _id: user._doc._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: true,
      sameSite: true,
    });
    return res.json({ message: "Logged in" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Something went wrong" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Authorized" });
  } catch (e) {
    res.clearCookie("token");
    console.log(e);
    return res.status(401).json({ message: "Something went wrong" });
  }
};
