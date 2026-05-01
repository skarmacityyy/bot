import { SlashCommandBuilder } from 'discord.js';
import { db } from '../../models/index.js';

export default {
  data: new SlashCommandBuilder().setName('setup').setDescription('Setup guild config')
    .addRoleOption((o) => o.setName('staff_role').setDescription('Staff role').setRequired(true))
    .addChannelOption((o) => o.setName('ticket_category').setDescription('Ticket category').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('staff_role');
    const category = interaction.options.getChannel('ticket_category');
    const [cfg] = await db.GuildConfig.upsert({ guildId: interaction.guildId, staffRoleIds: [role.id], ticketCategoryId: category.id });
    await interaction.reply({ content: `Setup complete (${cfg.guildId})`, ephemeral: true });
  }
};
