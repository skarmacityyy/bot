import { db } from '../models/index.js';
import { PermissionError } from '../utils/errors.js';

export async function requireStaff(interaction) {
  const config = await db.GuildConfig.findOne({ where: { guildId: interaction.guildId } });
  const has = interaction.member.roles.cache.some((r) => config?.staffRoleIds?.includes(r.id));
  if (!has) throw new PermissionError();
}
