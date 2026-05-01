# Discord Ticket SaaS Bot

Production-grade Discord ticket bot built with Node.js LTS + discord.js v14.

## Features
- Slash-command driven ticket operations
- Staff permissions and claim workflow
- Auto-close background jobs
- Transcript generation
- PostgreSQL + Sequelize persistence
- Redis cooldowns
- Health and metrics endpoints

## Setup
1. Copy `.env.example` to `.env`.
2. `npm install`
3. `npm run migrate`
4. `npm run register`
5. `npm start`

## Environment Variables
See `.env.example`.

## Commands
- `/setup`
- `/ticket create|close|claim`
- `/ping`

## Deployment
- Docker: `docker compose up -d --build`
- PM2: `pm2 start ecosystem.config.cjs`

## Production Notes
- Use managed PostgreSQL and Redis.
- Configure persistent volume for transcripts/logs.
- Restrict bot permissions to required scopes.
