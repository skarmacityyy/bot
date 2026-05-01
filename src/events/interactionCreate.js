import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export default (client) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction, client);
      } else if (interaction.isButton()) {
        const [name] = interaction.customId.split(':');
        const handler = client.buttons.get(name);
        if (handler) await handler.execute(interaction, client);
      }
    } catch (error) {
      logger.error({ err: error });
      const msg = error instanceof AppError ? error.message : 'Unexpected error.';
      if (interaction.deferred || interaction.replied) await interaction.followUp({ content: msg, ephemeral: true });
      else await interaction.reply({ content: msg, ephemeral: true });
    }
  });
};
