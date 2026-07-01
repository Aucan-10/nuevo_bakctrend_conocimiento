// //MODO CORRER EN PC
// import app from "./app.js";

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Corriendo app en ${PORT}`);
// });

//==== MODO SEVERLESS ====
import app from "./app.js";

// Exportar para Vercel (Serverless)
export default app;

// Solo escuchar puerto si NO estamos en Vercel (desarrollo local)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Corriendo app en ${PORT}`);
  });
}
