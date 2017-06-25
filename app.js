const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config/config.json');
const tracking = require('./config/tracking.json');
const _commands = require('./commands/_commands');

const WebSocket = require('ws');
const socket = new WebSocket('wss://api.ripple.moe/api/v1/ws');
const { newScore } = require('./websocket/newscore');

client.on('message', message => {
    _commands.execute(client, message, socket);
});

client.login(config.token) 
    .then(() => {client.user.setStatus(config.defaultStatus)})
    .then(() => {client.user.setGame(config.playingGame)})
    .then(() => {
        console.log(`\n----------------------\n\n` +
                    `Connection: Vibe has connected succesfully!\n` +
                    `Started at: ${client.readyAt}\n` + 
                    `User: ${client.user}\n` +
                    `Playing Game: ${config.playingGame}\n` + 
                    `Current Status: ${config.defaultStatus}\n` +
                    `Owner Discord Id: ${config.ownerId}\n` +
                    `Uptime: ${client.uptime}ms\n` +
                    `Guilds: ${client.guilds.array().length}\n` +
                    `Channels: ${client.channels.array().length}\n` +
                    `\n----------------------\n`)        
    })
    .catch((err) => {throw new Error(err)});

/*
 * WebSocket
 */
socket.onopen = (event) => {

    let trackingUsers = [];
    tracking.tracking.forEach((user) => {
        trackingUsers.push({user: user, modes: [3]})
    });

    // Subscribe to all tracking user scores
    let message = {type: 'subscribe_scores', data: trackingUsers}

    socket.send(JSON.stringify(message));

	socket.onmessage = function(event) {

        let newMessage = JSON.parse(event.data);

        if (newMessage.type == "connected" || newMessage.type == "subscribed" || (newMessage.type == "new_score" && newMessage.data.play_mode == 3))
            console.log("Vibe: New Message Incoming: ", newMessage.type);

        if (newMessage.type == "new_score" && newMessage.data.play_mode == 3 && newMessage.data.pp >= 600)
            newScore(client, newMessage.data);
	};

	// If socket closes, just throw an error for now.
	socket.onclose = function(event) {
		throw new Error('Socket Closed.');
	};
	
}