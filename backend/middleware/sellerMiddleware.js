import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const seller = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    return next();
  }

  return res.status(403).json({
    message: "Not authorized as seller",
  });
};
