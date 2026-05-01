import fs from 'node:fs/promises';
import path from 'node:path';

async function loadDir(dir) {
  const files = await fs.readdir(dir);
  return files.filter((f) => f.endsWith('.js')).map((f) => path.join(dir, f));
}

export async function loadCommands(client) {
  client.commands = new Map();
  for (const base of ['src/commands/admin', 'src/commands/tickets', 'src/commands/utility']) {
    for (const file of await loadDir(base)) {
      const mod = (await import(path.resolve(file))).default;
      client.commands.set(mod.data.name, mod);
    }
  }
}

export async function loadButtons(client) {
  client.buttons = new Map();
  for (const file of await loadDir('src/buttons')) {
    const mod = (await import(path.resolve(file))).default;
    client.buttons.set(mod.id, mod);
  }
}
