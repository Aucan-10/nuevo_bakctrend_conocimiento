import { Pool } from "pg";
import { config } from "./config.js";

// Creamos y definimos el POOL de conexion
export const pool = new Pool({
  host: config.dbHost,
  port: config.dbPort,
  database: config.dbName,
  user: config.dbUser,
  password: config.dbPassword,
  ssl: {
    rejectUnauthorized: false,
  },
});
