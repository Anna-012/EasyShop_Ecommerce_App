import joi from "joi";

const userRegistrationSchema = joi.object({
  name: joi.string().trim().min(3).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "any.required": "Name is required",
  }),

  email: joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email",
    "any.required": "Email is required",
  }),

  password: joi.string().trim().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

export default userRegistrationSchema;
