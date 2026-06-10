import express from "express";
import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import path from "path";
import { fileURLToPath } from "url";

import { server } from "./config/config.js";
import { connectDatabase, sequelize } from "./config/db/db.js";
import "./models/index.js";

import routes from "./routes/indexRoutes.js";
import { requireAuth } from "./middlewares/authMidleware.js";
import { showHome } from "./controllers/dashboardController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedApp = null;

const bootstrap = async () => {
  if (cachedApp) {
    return cachedApp;
  }

  const app = express();

  // Confiar en el proxy de Vercel en producción para que las cookies seguras funcionen
  if (server.isProduction) {
    app.set("trust proxy", 1);
  }

  //Configuracion Motor de Vistas (PUG)
  app.set("view engine", "pug");
  app.set("views", path.join(__dirname, "views"));

  //Middlewares Generales
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));

  //Configuracion de Sesiones en BD
  const SequelizeStore = connectSessionSequelize(session.Store);
  const sessionStore = new SequelizeStore({ db: sequelize });

  try {
    await connectDatabase();
    await sessionStore.sync();
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    // Si la BD falla, la app no puede funcionar.
    process.exit(1);
  }

  app.use(
    session({
      secret: server.sessionSecret,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: server.isProduction, //en produccion HTTPS(true), en desarrollo HTTP(false)
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  //Middleware global para vistas (inyecta la sesion)
  app.use((req, res, next) => {
    req.user = req.session.user || null;
    res.locals.currentUser = req.session.user || null;
    next();
  });

  //Rutas de la aplicacion
  app.use("/post", requireAuth, routes.postRoutes);
  app.get("/dashboard", requireAuth, showHome);
  app.get("/dashboard/", requireAuth, showHome);
  app.use("/dashboard", requireAuth, routes.dashboardRoutes);
  app.use("/user", requireAuth, routes.userRoutes);
  app.use("/auth", routes.authRoutes);
  app.use("/search", routes.searchRoutes);
  app.use("/", routes.homeRoutes);

  //Manejo de Errores (rutas no encontradas)
  app.use((req, res, next) => {
    const err = new Error(`💥 No se encontró la ruta ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
  });

  //Middleware Global de Manejo de Errores
  app.use((err, req, res, next) => {
    console.error("💥 ERROR ATRAPADO:", err.message);
    res.status(err.statusCode || 500).render("error.pug", {
      success: false,
      error: err.message || "Error interno del servidor",
    });
  });

  cachedApp = app;
  return app;
};

// Para desarrollo local, iniciar el servidor.
const startLocalServer = async () => {
  if (!server.isProduction) {
    const localApp = await bootstrap();
    localApp.listen(server.port, () => {
      console.log(`Servidor corriendo en: http://localhost:${server.port}`);
    });
  }
};

startLocalServer();

// Handler para Vercel
export default async (req, res) => {
  const app = await bootstrap();
  app(req, res);
};
