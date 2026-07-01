import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js"; // ← AGREGAR
import healthRoutes from "./routes/health.routes.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
// Cargar la documentación de Swagger
const swaggerDocument = YAML.load("./swagger.yaml");

// Configurar Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/enrollments", enrollmentRoutes); // ← AGREGAR

export default app;
