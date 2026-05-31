const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not configured for auth middleware");
      return res.status(500).json({
        message: "Server configuration error: missing JWT secret",
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.slice(7)
      : authHeader;

    const decoded = jwt.verify(
      token,
      secret
    );

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });

  }

};

module.exports = authMiddleware;