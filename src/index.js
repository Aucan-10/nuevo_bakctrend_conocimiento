import app from "./app.js";

// Exportar para Vercel
export default app;

// Solo escuchar puerto en desarrollo local
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Corriendo app en ${PORT}`);
  });
}
