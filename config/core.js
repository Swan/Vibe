import * as config from './config.json';
import { establishWebSocketConnection } from './websocket';

export async function login(client) {
    try {
        await client.login(config.botToken);
        await client.user.setStatus(config.defaultStatus);
        await client.user.setGame(config.playingGame);
        await establishWebSocketConnection(client);

        console.log(`\n----------------------\n\n` +
                        `Connection: Vibe has connected succesfully!\n` +
                        `Started at: ${client.readyAt}\n` + 
                        `User: ${client.user}\n` +
                        `Playing Game: ${config.playingGame}\n` + 
                        `Owner Discord Id: ${config.ownerId}\n` +
                        `Uptime: ${client.uptime}ms\n` +
                        `Guilds: ${client.guilds.array().length}\n` +
                        `Channels: ${client.channels.array().length}\n` +
                        `\n----------------------\n`)

    } catch (err) {
        throw new Error(err);   
    }
}