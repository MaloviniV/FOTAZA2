import express from "express";
import {server} from "./config/config.js";
import path from "path";
import { fileURLToPath } from "url";
//Importacion de routes
import indexRoutes from "./routes/indexRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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
app.use("/auth", authRoutes);
app.use("/", indexRoutes);


//Levantar el servidor
const PORT = server.port;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
