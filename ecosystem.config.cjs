module.exports = {
  apps: [{
    name: 'ticket-bot',
    script: 'src/index.js',
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production' }
  }]
};
