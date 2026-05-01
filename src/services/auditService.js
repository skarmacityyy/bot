import { db } from '../models/index.js';
export const auditService = { async log(guildId, actorId, action, targetId = null, meta = {}) { return db.AuditLog.create({ guildId, actorId, action, targetId, meta }); } };
