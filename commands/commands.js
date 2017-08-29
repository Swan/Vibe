import * as config from '../config/config.json';

import { ripple } from './ripple';
import { osu } from './osu';
import { checkMap } from './map';

export async function execute(client, message) {
    try {
        if (message.author.bot) return;
        if (!message.content.startsWith(config.commandPrefix)) return;
        if (!message.guild) return await message.reply("Please only execute commands in a guild.");

        const command = message.content.split(" ")[0].slice(config.commandPrefix.length);
        const args = message.content.split(" ").slice(1);

        switch (command) {
            case 'ripple':
                console.log(`[VIBE - COMMANDS] User ${message.author} executed command: ${command}`);
                return await ripple(client, message, args);
            case 'osu':
                console.log(`[VIBE - COMMANDS] User ${message.author} executed command: ${command}`);
                return await osu(client, message, args);
            case 'map':
                console.log(`[VIBE - COMMANDS] User ${message.author} executed command: ${command}`);
                return await checkMap(client, message, args);
        }

    } catch (err) {
        console.log(err);
    }
}