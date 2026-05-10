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

app.use("/image", apiRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", privateRoutes);
app.use("/", publicRoutes);

app.get("/favicon.ico", (req, res) => res.status(204).end());

//Manejo de errores
app.use((req, res, next) => {   //Rutas no encontradas
  next(new AppError(`No se encontro la ruta ${req.originalUrl}`, 404));
});
app.use(errorHandler);  //Errores generales

//Levantar el servidor
const PORT = server.port;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
