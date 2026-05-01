import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { env } from './config/env.js';
import { db } from './models/index.js';
import { logger } from './utils/logger.js';
import { loadButtons, loadCommands } from './managers/loaderManager.js';
import readyEvent from './events/ready.js';
import interactionEvent from './events/interactionCreate.js';
import { startHttpServer } from './services/httpService.js';
import { startJobs } from './services/jobService.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

await db.sequelize.authenticate();
await db.sequelize.sync();
await loadCommands(client);
await loadButtons(client);
readyEvent(client);
interactionEvent(client);

const server = startHttpServer(env.PORT, { client, db });
startJobs({ db, client });

process.on('SIGTERM', async () => { await client.destroy(); server.close(); process.exit(0); });
client.login(env.DISCORD_TOKEN).catch((e) => logger.error(e));
