import express from "express";
import mongoose from "mongoose";
import * as validators from "./validation/validators.js";
import cookieParser from "cookie-parser";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostsController.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => console.log("connected to the db"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("11211 Hello world!");
});

app.post(
  "/auth/register",
  validators.registerValidation,
  UserController.register
);
app.post("/auth/login", validators.loginValidation, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  validators.postCreateValidation,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  validators.postUpdateValidation,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
});
