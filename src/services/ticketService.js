import { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createTranscript } from 'discord-html-transcripts';
import { db } from '../models/index.js';
import { redis } from '../config/redis.js';
import { PermissionError, ValidationError } from '../utils/errors.js';

const key = (g, u) => `ticket:cooldown:${g}:${u}`;

export const ticketService = {
  async create(interaction, { type = 'general', category = 'support' } = {}) {
    const guildId = interaction.guildId;
    const creatorId = interaction.user.id;
    const config = await db.GuildConfig.findOne({ where: { guildId } });
    if (!config) throw new ValidationError('Guild not configured. Run /setup first.');
    const blacklisted = await db.UserBlacklist.findOne({ where: { guildId, userId: creatorId } });
    if (blacklisted) throw new PermissionError('You are blacklisted from using tickets.');

    const cd = await redis.get(key(guildId, creatorId));
    if (cd) throw new ValidationError(`Cooldown active. Try again in ${cd}s.`);

    const openCount = await db.Ticket.count({ where: { guildId, creatorId, status: 'open' } });
    if (openCount >= config.maxOpenTickets) throw new ValidationError('You reached max open tickets.');

    const lastTicket = await db.Ticket.findOne({ where: { guildId }, order: [['ticketNumber', 'DESC']] });
    const ticketNumber = (lastTicket?.ticketNumber || 0) + 1;
    const name = `ticket-${ticketNumber}`;

    const channel = await interaction.guild.channels.create({
      name,
      type: ChannelType.GuildText,
      parent: config.ticketCategoryId || null,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: creatorId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ...config.staffRoleIds.map((id) => ({ id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }))
      ]
    });

    const ticket = await db.Ticket.create({ guildId, channelId: channel.id, ticketNumber, creatorId, ownerId: creatorId, type, category, lastActivityAt: new Date() });
    await db.TicketParticipant.create({ ticketId: ticket.id, userId: creatorId, addedBy: creatorId });

    await redis.setex(key(guildId, creatorId), config.ticketCooldownSeconds, config.ticketCooldownSeconds.toString());

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`ticket_claim:${ticket.id}`).setLabel('Claim').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`ticket_close:${ticket.id}`).setLabel('Close').setStyle(ButtonStyle.Danger)
    );
    const embed = new EmbedBuilder().setTitle(`Ticket #${ticketNumber}`).setDescription(`Type: **${type}**\nCategory: **${category}**`).setColor(0x00aaff);
    await channel.send({ content: `<@${creatorId}>`, embeds: [embed], components: [row] });
    return { ticket, channel };
  },

  async close(interaction, ticket, reason = 'Closed by staff') {
    ticket.status = 'closed'; await ticket.save();
    const channel = interaction.guild.channels.cache.get(ticket.channelId);
    if (!channel) return;
    const transcript = await createTranscript(channel, { filename: `ticket-${ticket.ticketNumber}.html`, saveImages: true, poweredBy: false });
    await db.TicketTranscript.create({ ticketId: ticket.id, path: transcript.name, url: null });
    await channel.send({ content: `Ticket closed. Reason: ${reason}` });
  }
};
