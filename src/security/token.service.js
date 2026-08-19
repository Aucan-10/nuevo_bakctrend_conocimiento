import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; // Cambia esto por una clave secreta segura

// Generar un token basado en un ID
export const generateToken = (id) => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: "1h" });
};

// Verificar y decodificar un token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};
