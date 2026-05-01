import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const GuildConfig = sequelize.define('GuildConfig', {
  guildId: { type: DataTypes.STRING, unique: true, allowNull: false },
  staffRoleIds: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  logChannelId: DataTypes.STRING,
  ticketCategoryId: DataTypes.STRING,
  maintenanceMode: { type: DataTypes.BOOLEAN, defaultValue: false },
  maxOpenTickets: { type: DataTypes.INTEGER, defaultValue: 3 },
  ticketCooldownSeconds: { type: DataTypes.INTEGER, defaultValue: 60 }
}, { indexes: [{ fields: ['guildId'] }] });

export const Ticket = sequelize.define('Ticket', {
  guildId: { type: DataTypes.STRING, allowNull: false },
  channelId: { type: DataTypes.STRING, unique: true },
  ticketNumber: { type: DataTypes.INTEGER, allowNull: false },
  creatorId: { type: DataTypes.STRING, allowNull: false },
  ownerId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('open', 'closed', 'locked'), defaultValue: 'open' },
  type: DataTypes.STRING,
  category: DataTypes.STRING,
  priority: { type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'), defaultValue: 'normal' },
  claimedBy: DataTypes.STRING,
  lastActivityAt: DataTypes.DATE
}, { indexes: [{ fields: ['guildId', 'status'] }, { fields: ['creatorId'] }] });

export const TicketMessage = sequelize.define('TicketMessage', {
  ticketId: DataTypes.INTEGER,
  messageId: DataTypes.STRING,
  authorId: DataTypes.STRING,
  content: DataTypes.TEXT
});
export const TicketParticipant = sequelize.define('TicketParticipant', { ticketId: DataTypes.INTEGER, userId: DataTypes.STRING, addedBy: DataTypes.STRING });
export const TicketNote = sequelize.define('TicketNote', { ticketId: DataTypes.INTEGER, staffId: DataTypes.STRING, note: DataTypes.TEXT });
export const TicketTag = sequelize.define('TicketTag', { ticketId: DataTypes.INTEGER, tag: DataTypes.STRING });
export const TicketTranscript = sequelize.define('TicketTranscript', { ticketId: DataTypes.INTEGER, url: DataTypes.STRING, path: DataTypes.STRING });
export const TicketRating = sequelize.define('TicketRating', { ticketId: DataTypes.INTEGER, userId: DataTypes.STRING, score: DataTypes.INTEGER, feedback: DataTypes.TEXT });
export const TicketPanel = sequelize.define('TicketPanel', {
  guildId: DataTypes.STRING,
  channelId: DataTypes.STRING,
  messageId: DataTypes.STRING,
  panelKey: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  buttonLabel: DataTypes.STRING,
  routeCategory: DataTypes.STRING,
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
});
export const StaffStat = sequelize.define('StaffStat', { guildId: DataTypes.STRING, staffId: DataTypes.STRING, claimed: DataTypes.INTEGER, closed: DataTypes.INTEGER, avgResponseSeconds: DataTypes.FLOAT });
export const StaffAction = sequelize.define('StaffAction', { guildId: DataTypes.STRING, staffId: DataTypes.STRING, ticketId: DataTypes.INTEGER, action: DataTypes.STRING, meta: DataTypes.JSONB });
export const UserBlacklist = sequelize.define('UserBlacklist', { guildId: DataTypes.STRING, userId: DataTypes.STRING, reason: DataTypes.TEXT, expiresAt: DataTypes.DATE });
export const AuditLog = sequelize.define('AuditLog', { guildId: DataTypes.STRING, actorId: DataTypes.STRING, action: DataTypes.STRING, targetId: DataTypes.STRING, meta: DataTypes.JSONB });

Ticket.hasMany(TicketMessage, { foreignKey: 'ticketId' });
Ticket.hasMany(TicketParticipant, { foreignKey: 'ticketId' });
Ticket.hasMany(TicketNote, { foreignKey: 'ticketId' });
Ticket.hasMany(TicketTag, { foreignKey: 'ticketId' });
Ticket.hasOne(TicketTranscript, { foreignKey: 'ticketId' });
Ticket.hasOne(TicketRating, { foreignKey: 'ticketId' });

export const db = { sequelize, GuildConfig, Ticket, TicketMessage, TicketParticipant, TicketNote, TicketTag, TicketTranscript, TicketRating, TicketPanel, StaffStat, StaffAction, UserBlacklist, AuditLog };
