// token.service.js
import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET_KEY = process.env.JWT_SECRET; // usá el .env, no un string hardcodeado

export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, SECRET_KEY, { expiresIn: "24h" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};
