import express from "express";
import { server } from "./config/config.js";
import { connectDatabase, sequelize } from "./config/db.js";
import "./models/index.js";
import path from "path";
import { fileURLToPath } from "url";

//Importacion de routes
import * as routes from "./routes/indexRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";
import { requireAuth } from "./middlewares/authMidleware.js";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";

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

const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

// express-session
app.use(
  session({
    secret: server.sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Middleware global para inyectar la sesión en req.user
app.use((req, res, next) => {
  req.user = req.session.user || null;
  res.locals.currentUser = req.session.user || null;
  next();
});

//Middleware de rutas
app.use("/post", requireAuth, routes.postRoutes);
app.use("/api", routes.apiRoutes);
app.use("/auth", routes.authRoutes);
app.use("/dashboard", requireAuth, routes.dashboardRoutes);
app.use("/user", requireAuth, routes.userRoutes);
app.use("/", routes.homeRoutes);

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

    // Sincronizar la tabla de sesiones en la BD
    await sessionStore.sync();

    //FORZADO DE INICIO DE SESION CON USUARIO EN BD Y CREACION SI NO EXISTE
    const [testUser, created] = await User.findOrCreate({
      where: { email: "mail@mail.com" },
      defaults: {
        firstName: "Vic",
        lastName: "Malo",
        nickname: "@testVic",
        dni: "11111111",
        birthdate: "1988-02-20",
        password: "1111",
        role: "usuario",
        avatarUrl:
          "https://ui-avatars.com/api/?name=Vic+Malo&background=random",
      },
    });

    if (testUser) {
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
