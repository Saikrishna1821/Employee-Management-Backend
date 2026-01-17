const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await jwt.verify(token, process.env.SECRETKEY);
    next();
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
};

module.exports = { verifyToken };
