import { db } from '../models/index.js';
import { ticketService } from '../services/ticketService.js';
import { requireStaff } from '../middlewares/permissions.js';

export default {
  id: 'ticket_close',
  async execute(interaction) {
    await requireStaff(interaction);
    const [, id] = interaction.customId.split(':');
    const ticket = await db.Ticket.findByPk(id);
    await ticketService.close(interaction, ticket, 'Closed via button');
    await interaction.reply({ content: 'Closed', ephemeral: true });
  }
};
