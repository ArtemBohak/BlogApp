import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("11211 Hello world!");
});

app.post("/auth/login", (req, res) => {
  const body = req.body;

  const token = jwt.sign({ email: req.body.email, fullname: "Bilbo" }, process.env.SECRET_KEY);

  res.json({ message: true });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
});
