import * as Discord from 'discord.js';
import * as core from './config/core';
import * as commands from './commands/commands';

const client = new Discord.Client();

client.on('message', (message) => {
    commands.execute(client, message);
});

core.login(client);
