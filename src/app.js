import express from "express";
import { server } from "./config/config.js";
import { connectDatabase } from "./config/db.js";
import "./models/index.js";
import path from "path";
import { fileURLToPath } from "url";

//Importacion de routes
import * as routes from "./routes/indexRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";
import { requireAuth } from "./middlewares/authMidleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Inicializar Express
const app = express();

//Configurar PUG
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Middlewares
app.use(express.urlencoded({ extended: true })); //Para leer datos de formularios
app.use(express.json()); //Para leer datos en JSON
app.use(express.static(path.join(__dirname, "..", "public"))); //Donde buscar archivos estaticos

// HARDCODEAR SESION GLOBAL
app.use((req, res, next) => {
  req.user = global.currentUser || null;
  res.locals.user = global.currentUser || null;
  next();
});

//Middleware de rutas
app.use("/post", routes.postRoutes);
//app.use("/image", routes.apiRoutes);
app.use("/auth", routes.authRoutes);
app.use("/dashboard", requireAuth, routes.dashboardRoutes);
app.use("/", routes.publicRoutes);

//Manejo de errores
app.use((req, res, next) => {
  //Rutas no encontradas
  next(new AppError(`No se encontro la ruta ${req.originalUrl}`, 404));
});
app.use(errorHandler); //Errores generales

//Levantar el servidor y BD
import User from "./models/User.js";
import { seedTestData } from "./seeders/testSeeder.js";
(async () => {
  try {
    await connectDatabase();
    //FORZADO DE INICIO DE SESION CON USUARIO EN BD
    const testUser = await User.findOne({ where: { email: "mail@mail.com" } });
    if (testUser) {
      const userData = testUser.toJSON();
      global.currentUser = userData;

      // Ejecutar los datos de prueba
      await seedTestData(testUser);
    }
  } catch (error) {
    if (server.debug) {
      console.error("Error al inicializar la base de datos:", error);
    } else {
      console.error("Error critico: No se pudo conectar a la base de datos.");
    }
    process.exit(1);
  }

  const PORT = server.port;
  const expressServer = app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
  });

  expressServer.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Error critico: El puerto ${PORT} ya esta en uso.`);
    } else {
      console.error("Error al arrancar el servidor Express:", error);
    }
    process.exit(1);
  });
})();
