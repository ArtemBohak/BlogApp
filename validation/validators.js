import { body } from "express-validator";

export const loginValidation = [
  body("email", "The email field is invalid").isEmail(),
];

export const registerValidation = [
  body("email", "The email field is invalid").isEmail(),
  body("password", "The password field is invalid").isLength({ min: 5 }),
  body("fullName", "The full name field is invalid").isLength({ min: 2 }),
  body("avatarUrl", "The avatar url field is invalid").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "The title cannot be shorter than 3 characters")
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "The text cannot be shorter than 35 characters")
    .isLength({
      min: 35,
    })
    .isString(),
  body("tags", "The tags must be included in an array").optional().isArray(),
  body("imageUrl", "The image url should be a string").optional().isString(),
];

export const postUpdateValidation = [
  body("title", "The title cannot be shorter than 3 characters")
    .optional()
    .isLength({
      min: 3,
    })
    .isString(),
  body("text", "The text cannot be shorter than 35 characters")
    .optional()
    .isLength({
      min: 35,
    })
    .isString(),
  body("tags", "The tags must be included in an array").optional().isArray(),
  body("imageUrl", "The image url should be a string").optional().isString(),
];
