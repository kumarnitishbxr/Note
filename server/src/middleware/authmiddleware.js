import jwt from "jsonwebtoken";
import redisClient from "../config/redis";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    // Redis blacklist check
    if (redisClient?.isOpen) {
      const blocked = await redisClient.get(`token:${token}`);
      if (blocked) {
        return res.status(401).json({ message: "Session expired" });
      }
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;

    next(); // 🔥 VERY IMPORTANT

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
