//configuración de express
import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";

import healthRoutes from "./routes/health.routes.js";
// import usuarios from "./router/users";
// import materias from "./router/materias";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// //Rutas
app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", userRoutes);
// app.use("/users", usuarios);
// app.use("/materias", materias);

export default app; //Se exporta para que lo use el Index.js
