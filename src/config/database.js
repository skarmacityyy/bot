import { Sequelize } from 'sequelize';
import { env } from './env.js';

export const sequelize = new Sequelize(env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false,
  pool: { max: 20, min: 2 }
});
