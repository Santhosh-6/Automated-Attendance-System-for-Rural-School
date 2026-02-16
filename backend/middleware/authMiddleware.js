import jwt from "jsonwebtoken";
const SECRET = "attendance_secret_key";

const authMiddleware = (req, res, next) => {
const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
