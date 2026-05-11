import express from "express";
import {server} from "./config/config.js";
import path from "path";
import { fileURLToPath } from "url";

//Importacion de routes
import publicRoutes from "./routes/publicRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import privateRoutes from "./routes/privateRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";
import sequelize from "./config/db.js";
import "./models/index.js"

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

//Middleware de rutas
app.get("/favicon.ico", (req, res) => res.status(204).end()); //ruta faviconico

app.use("/image", apiRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", privateRoutes);
app.use("/", publicRoutes);


//Manejo de errores
app.use((req, res, next) => {   //Rutas no encontradas
  next(new AppError(`No se encontro la ruta ${req.originalUrl}`, 404));
});
app.use(errorHandler);  //Errores generales

//Levantar el servidor y BD
(async () => {
  try {
/*     console.log("Base de datos conectada:", sequelize.config.database);
    console.log("Modelos registrados:", Object.keys(sequelize.models));
 */
    await sequelize.sync({alter: true});
    console.log("BD sincronizada y conectada con exito");

    const PORT = server.port;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });  
  } catch (error) {
    if (server.debug) {
      console.error("Error al inicializar la base de datos:", error);
    } else {
      console.error("Error crítico: No se pudo conectar a la base de datos.");
    }
    process.exit(1);
  }
})();

