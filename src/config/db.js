import { Sequelize } from "sequelize";
import { database, server } from "./config.js";

export const sequelize = new Sequelize(
  database.name,
  database.user,
  database.password,
  {
    host: database.host,
    dialect: database.dialect,
    logging: server.debug ? console.log : false,
  },
);

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida con éxito.");

    if (database.sync) {
      await sequelize.sync({ alter: true});
      console.log("✅ BD sincronizada con exito");
      //CONSTRAINTS
      await sequelize.query(`
        DO $$ 
        BEGIN
            ALTER TABLE "follows" DROP CONSTRAINT IF EXISTS "seguirse";
            
            ALTER TABLE "follows" 
            ADD CONSTRAINT "seguirse" 
            CHECK ("followerId" <> "followingId");
        END $$;
      `);
      await sequelize.query(`
        DO $$
        BEGIN
            ALTER TABLE "ratings" DROP CONSTRAINT IF EXISTS "score_range";

            ALTER TABLE "ratings"
            ADD CONSTRAINT "score_range"
            CHECK (score >= 1 AND score <= 5);
        END $$;
      `);

      // Trigger para evitar que un usuario se califique a sí mismo
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
    } else {
      console.log("⚠️  BD no sincronizada, habilita la sincronizacion en .env");
    }
  } catch (error) {
    throw error;
  }
};
