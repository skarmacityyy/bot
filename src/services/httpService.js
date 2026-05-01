import express from 'express';
import helmet from 'helmet';
import compression from 'compression';

export function startHttpServer(port, deps) {
  const app = express();
  app.use(helmet());
  app.use(compression());
  app.get('/health', (_req, res) => res.json({ ok: true, ws: deps.client.ws.status, db: 'ok' }));
  app.get('/metrics', async (_req, res) => {
    const open = await deps.db.Ticket.count({ where: { status: 'open' } });
    res.json({ openTickets: open, uptime: process.uptime() });
  });
  return app.listen(port);
}
