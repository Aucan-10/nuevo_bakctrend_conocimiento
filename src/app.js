//configuración de express
import express from "express";
import cors from "cors";
import morgan from "morgan";

// import usuarios from "./router/users";
// import materias from "./router/materias";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// //Rutas
// app.use("/users", usuarios);
// app.use("/materias", materias);

export default app;
