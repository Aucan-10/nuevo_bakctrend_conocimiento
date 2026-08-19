// src/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

// Obtener el directorio actual de forma segura en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - backtrend",
      version: "1.0.0",
      description:
        "Documentación de la API para gestión de usuarios, materias e inscripciones",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desarrollo (Local)",
      },
      {
        url: "https://nuevo-bakctrend-conocimiento-5l0cqne6e.vercel.app",
        description: "Servidor de Producción (Vercel)",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

export default swaggerJSDoc(options);
