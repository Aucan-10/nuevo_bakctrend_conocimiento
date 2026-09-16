import cors from "cors";

// Esto permite que la APK se comunique con tu backend en Vercel
app.use(
  cors({
    origin: "*", // Permite cualquier origen (incluida la APK)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
