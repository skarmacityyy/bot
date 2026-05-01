import { SlashCommandBuilder } from 'discord.js';
export default { data: new SlashCommandBuilder().setName('ping').setDescription('Ping'), async execute(i) { await i.reply({ content: 'Pong!', ephemeral: true }); } };
