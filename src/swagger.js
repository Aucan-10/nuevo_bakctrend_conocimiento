// src/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - backtrend",
      version: "1.0.0",
      description: "Documentación de la API usando Swagger",
    },
    servers: [{ url: "http://localhost:3000", description: "Servidor local" }],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

export default swaggerJSDoc(options);
