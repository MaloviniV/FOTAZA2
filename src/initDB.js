import { sequelize, createDB, connectDatabase } from './config/db.js';


(async () => {
  try {
    await createDB();
    await connectDatabase();
    console.log('✅ BD inicializada.');
  } catch (error) {
    console.error('❌ ERROR al inicializar la BD:', error);
    process.exit(1);
  }
})();
