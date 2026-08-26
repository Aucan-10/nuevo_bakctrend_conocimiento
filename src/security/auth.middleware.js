import { verifyToken } from "../services/token.service.js";

export const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token is required" });
  }

  const token = authHeader.split(" ")[1]; // Asume formato "Bearer <token>"

  try {
    const payload = verifyToken(token);
    req.user = payload; // Agrega el payload desencriptado a la solicitud
    next(); // Llama al siguiente middleware o controlador
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
