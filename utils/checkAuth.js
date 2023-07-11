import jwt from "jsonwebtoken";
import "dotenv";

export default (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({
      message: "Not authorized",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decodedToken._id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Something went wrong" });
  }
};
