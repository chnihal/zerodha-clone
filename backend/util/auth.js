const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const hostedClientOrigins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.startsWith("https://"));
const cookieSecureOverride = process.env.COOKIE_SECURE;
const secureCookie =
  cookieSecureOverride === undefined
    ? process.env.NODE_ENV === "production" || hostedClientOrigins.length > 0
    : cookieSecureOverride === "true";
const sameSiteCookie =
  process.env.COOKIE_SAMESITE || (secureCookie ? "none" : "lax");

const cookieOptions = {
  httpOnly: true,
  sameSite: sameSiteCookie,
  secure: sameSiteCookie === "none" || secureCookie,
  maxAge: 3 * 24 * 60 * 60 * 1000,
};

const getAuthenticatedUser = async (req) => {
  const token = req.cookies?.token;

  if (!token) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  let data;
  try {
    data = jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(data.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { cookieOptions, getAuthenticatedUser };
