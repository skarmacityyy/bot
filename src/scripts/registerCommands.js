import { REST, Routes } from 'discord.js';
import { env } from '../config/env.js';
import { loadCommands } from '../managers/loaderManager.js';

const fakeClient = {};
await loadCommands(fakeClient);
const body = [...fakeClient.commands.values()].map((c) => c.data.toJSON());
const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
const route = env.DISCORD_GUILD_ID ? Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID) : Routes.applicationCommands(env.DISCORD_CLIENT_ID);
await rest.put(route, { body });
console.log(`Registered ${body.length} commands`);
