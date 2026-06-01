const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 3 * 24 * 60 * 60 * 1000,
};

const userResponse = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
  createdAt: user.createdAt,
});

module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body || {};

    if (!email || !password || !username) {
      return res.status(400).json({
        message: "Email, password, and username are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const user = await User.create({ email, password, username });
    const token = createSecretToken(user._id);
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user: userResponse(user),
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
        success: false,
      });
    }

    return res.status(500).json({
      message: "Signup failed",
      success: false,
    });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: userResponse(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};
