import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import redisClient from "../config/redis.js";



const cookieOptions = {
  httpOnly: true,
  secure: true,      // HTTPS only
  sameSite: "none",  // Cross-site cookies
  maxAge: 24 * 60 * 60 * 1000
};


const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXP }
    );

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXP }
    );

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User login successful"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};


const Logout = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No active session"
      });
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    // Blacklist token in Redis
    await redisClient.set(`token:${token}`, "blocked");
    await redisClient.expireAt(`token:${token}`, payload.exp);

    // res.clearCookie("token", cookieOptions);
    res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});


    res.status(200).json({
      success: true,
      message: "User logged out successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
};

export { Register, Login, Logout };
