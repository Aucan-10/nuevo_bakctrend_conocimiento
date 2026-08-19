import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import healthRoutes from "./routes/health.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Configurar Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/enrollments", enrollmentRoutes);

export default app;
