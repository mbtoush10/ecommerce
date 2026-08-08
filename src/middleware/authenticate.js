const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // جلب التوكن من الـ Header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // إذا ما في توكن، بنرجع 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  // التحقق من صحة التوكن
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
    // إذا التوكن صحيح، بنخزن بيانات المستخدم بالطلب (req.user)
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;