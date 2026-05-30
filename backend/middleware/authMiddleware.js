const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // FIX: Extract token from "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ") 
      ? authHeader.slice(7)  // Remove "Bearer " (7 characters)
      : authHeader;           // Fallback for raw token (backward compatibility)

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
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