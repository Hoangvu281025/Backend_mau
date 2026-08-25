import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json("Chưa đăng nhập");

  const token = authHeader.split(" ")[1]; // Bearer xxx

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Token không hợp lệ");

    req.user = user; // { id, role }
    console.log("User from token:", req.user); // Debug log
    next();
  });
};


export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền" });
  }
  next();
};