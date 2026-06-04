import jwt from "jsonwebtoken";
import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       return next();
//     } catch (error) {
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   return res.status(401).json({ message: "Not authorized, no token" });
// };

// 🔥 ADMIN CHECK

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized as admin" });
};
