const jwt = require("jsonwebtoken");

const verifyToken = (accountType) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET );
      req.user = {
        id: decoded.email,
        account_type: decoded.account_type,
      };
      
      // Kiểm tra loại tài khoản nếu accountType được truyền vào
      if (accountType && decoded.account_type !== accountType) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      console.error("Token error:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  };
};

module.exports = { verifyToken };
