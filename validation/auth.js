import { body } from "express-validator";

export const registerValidation = [
  body("email", "The email field is invalid").isEmail(),
  body("password", "The password field is invalid").isLength({ min: 5 }),
  body("fullName", "The full name field is invalid").isLength({ min: 2 }),
  body("avatarUrl", "The avatar url field is invalid").optional().isURL(),
];
