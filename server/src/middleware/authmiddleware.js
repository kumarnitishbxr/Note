import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ COOKIE SE TOKEN LO
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token"
      });
    }

    // ✅ REDIS BLACKLIST CHECK
    if (redisClient?.isOpen) {
      const isBlocked = await redisClient.get(`token:${token}`);
      if (isBlocked) {
        return res.status(401).json({
          success: false,
          message: "Session expired"
        });
      }
    }

    // ✅ JWT VERIFY
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // ✅ USER INFO ATTACH
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    // ✅ VERY IMPORTANT
    next();

  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};

export default authMiddleware;
