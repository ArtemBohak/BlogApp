import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import * as validators from "./validation/validators.js";
import { checkAuth, validateErrors } from "./utils/utils.js";
import { UserController, PostController } from "./controllers/controllers.js";

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => console.log("connected to the db"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("11211 Hello world!");
});

app.post(
  "/auth/register",
  validateErrors,
  validators.registerValidation,
  UserController.register
);
app.post(
  "/auth/login",
  validateErrors,
  validators.loginValidation,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  validateErrors,
  validators.postCreateValidation,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  validateErrors,
  validators.postUpdateValidation,
  PostController.update
);

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
});
