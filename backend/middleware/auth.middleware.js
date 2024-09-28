import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.model.js";
dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-linkedin-two"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
