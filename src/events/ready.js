import { logger } from '../utils/logger.js';
export default (client) => client.on('ready', () => logger.info(`Ready as ${client.user.tag}`));
