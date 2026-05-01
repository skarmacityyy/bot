import { SlashCommandBuilder } from 'discord.js';
import { ticketService } from '../../services/ticketService.js';
import { db } from '../../models/index.js';
import { requireStaff } from '../../middlewares/permissions.js';

export default {
  data: new SlashCommandBuilder().setName('ticket').setDescription('Ticket commands')
    .addSubcommand((s) => s.setName('create').setDescription('Create ticket').addStringOption((o) => o.setName('type').setDescription('Type')))
    .addSubcommand((s) => s.setName('close').setDescription('Close current ticket'))
    .addSubcommand((s) => s.setName('claim').setDescription('Claim current ticket')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'create') {
      const type = interaction.options.getString('type') || 'general';
      const { channel } = await ticketService.create(interaction, { type });
      return interaction.reply({ content: `Created: ${channel}`, ephemeral: true });
    }

    const ticket = await db.Ticket.findOne({ where: { channelId: interaction.channelId } });
    if (!ticket) return interaction.reply({ content: 'Not a ticket channel.', ephemeral: true });

    if (sub === 'close') {
      await requireStaff(interaction);
      await ticketService.close(interaction, ticket);
      return interaction.reply({ content: 'Closed.', ephemeral: true });
    }
    if (sub === 'claim') {
      await requireStaff(interaction);
      ticket.claimedBy = interaction.user.id; await ticket.save();
      return interaction.reply({ content: `Claimed by <@${interaction.user.id}>` });
    }
  }
};
