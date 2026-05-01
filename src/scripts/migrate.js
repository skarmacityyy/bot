import { db } from '../models/index.js';
await db.sequelize.sync({ alter: true });
console.log('Migrated');
