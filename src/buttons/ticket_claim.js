import { db } from '../models/index.js';
import { requireStaff } from '../middlewares/permissions.js';

export default {
  id: 'ticket_claim',
  async execute(interaction) {
    await requireStaff(interaction);
    const [, id] = interaction.customId.split(':');
    const ticket = await db.Ticket.findByPk(id);
    ticket.claimedBy = interaction.user.id;
    await ticket.save();
    await interaction.reply({ content: `Claimed ticket #${ticket.ticketNumber}`, ephemeral: true });
  }
};
