import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth.js";
import { validationResult } from "express-validator";
import User from "./models/User.js";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
app.use(express.json());
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => console.log("connected to the db"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("11211 Hello world!");
});

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
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
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Something went wrong" });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
});
