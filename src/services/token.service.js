import jwt from "jsonwebtoken";
import { config } from "../config.js"; // ajustá la ruta según dónde esté este archivo

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};
