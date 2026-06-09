import { Sequelize } from "sequelize";
import { database, server } from "../config.js";
import pg from "pg";

//OBJETO SEQUELIZE (configuracion)
export const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    dialect: database.dialect,
    dialectModule: pg,
    //logging: server.debug ? console.log : false,
    dialectOptions: server.isProduction
      ? {
          ssl: { require: true, rejectUnauthorized: false },
        }
      : {},
    pool: {
      max: server.isProduction ? 2 : 5,
      min: 0,
      acquire: 30000,
      idle: server.isProduction ? 0 : 10000,
    },
  },
);

//CONSTRAINTS Y TRIGGERS
const applyConstraintsAndTriggers = async () => {
  //CONSTRAINT: Un usuario no puede seguirse a si mismo
  await sequelize.query(`
    DO $$ 
    BEGIN
        ALTER TABLE "follows" DROP CONSTRAINT IF EXISTS "seguirse";
        
        ALTER TABLE "follows" 
        ADD CONSTRAINT "seguirse" 
        CHECK ("followerId" <> "followingId");
    END $$;
  `);

  //CONSTRAINT: Controla que la valoracion este entre 1 y 5
  await sequelize.query(`
    DO $$
    BEGIN
        ALTER TABLE "ratings" DROP CONSTRAINT IF EXISTS "score_range";

        ALTER TABLE "ratings"
        ADD CONSTRAINT "score_range"
        CHECK (score >= 1 AND score <= 5);
    END $$;
  `);

  //TRIGGER: Evita que un usuario califique su propio archivo
  await sequelize.query(`
    CREATE OR REPLACE FUNCTION check_self_rating()
    RETURNS TRIGGER AS $$
    DECLARE
        owner_id INTEGER;
    BEGIN
        SELECT p."idUser" INTO owner_id
        FROM "files" f
        JOIN "posts" p ON f."idPost" = p."id"
        WHERE f."id" = NEW."idFile";
        
        IF owner_id = NEW."idUser" THEN
            RAISE EXCEPTION 'Un usuario no puede calificar su propio archivo.';
        END IF;
        
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await sequelize.query(`
    DROP TRIGGER IF EXISTS trg_check_self_rating ON "ratings";
    CREATE TRIGGER trg_check_self_rating
    BEFORE INSERT OR UPDATE ON "ratings"
    FOR EACH ROW
    EXECUTE FUNCTION check_self_rating();
  `);

  console.log("✅ Restricciones y Triggers personalizados aplicados.");
};

//VERIFICO SI EXISTE O CREO LA BD
export const createDB = async () => {
  const { Client } = pg;
  try {
    const client = new Client({
      host: database.host,
      port: database.port,
      user: database.user,
      password: database.password,
      database: database.dialect,
    });

    await client.connect();

    const response = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${database.name}'`,
    );

    if (response.rowCount === 0) {
      console.log(`⚠️ BD '${database.name}' no encontrada. Creandola....`);

      await client.query(`CREATE DATABASE '${database.name}'`);

      console.log(`✅ BD '${database.name}' creada exitosamente.`);
    } else {
      console.log("La BD ya existe.");
    }

    await client.end();
  } catch (error) {
    console.error("❌ Error al verificar/crear la BD: ", error);
    throw error;
  }
};

//VERIFICA CONEXION DE BD, SINCRONIZA LAS TABLAS Y LAS PUEBLA
export const connectDatabase = async () => {
  await sequelize.authenticate();
  console.log("✅ Conexión a PostgreSQL establecida con éxito.");

  // Sincroniza la base de datos: crea tablas si no existen.
  // En desarrollo (DB_SYNC=true), alterará las tablas existentes.
  // En producción (DB_SYNC=false), solo creará tablas nuevas, sin alterar las existentes.
  await sequelize.sync({ alter: database.sync });
  console.log(`✅ BD sincronizada con éxito (alter: ${database.sync}).`);

  // Intenta poblar la base de datos. La función seedTestData verificará si ya hay datos.
  const { seedTestData } = await import("../../seeders/testSeeder.js");
  await seedTestData();

  await applyConstraintsAndTriggers();
};
