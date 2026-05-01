import cron from 'node-cron';
import { Op } from 'sequelize';

export function startJobs({ db, client }) {
  cron.schedule('*/10 * * * *', async () => {
    const stale = await db.Ticket.findAll({ where: { status: 'open', lastActivityAt: { [Op.lt]: new Date(Date.now() - 72 * 3600 * 1000) } } });
    for (const t of stale) {
      t.status = 'closed';
      await t.save();
      const channel = client.channels.cache.get(t.channelId);
      if (channel) await channel.send('Auto-closed for inactivity.');
    }
  });
}
