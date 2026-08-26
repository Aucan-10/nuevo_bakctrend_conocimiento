import rateLimit from "express-rate-limit";

// Límite general: 50 requests cada 15 minutos por IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50,
  message: { message: "Demasiadas solicitudes, intentá de nuevo más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Límite más estricto para auth (evita fuerza bruta en login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Demasiados intentos de autenticación, esperá unos minutos",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
