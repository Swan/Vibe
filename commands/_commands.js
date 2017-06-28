const config = require('../config/config.json');

const { ripple } = require('./ripple');
const { track } = require('./track');
const { map } = require('./map');
const { pp } = require('./pp');

module.exports.execute = (client, message, socket) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.commandPrefix)) return;
    if (!message.guild) return message.reply("Why are you trying to use commands outside of a server?");

    let command = message.content.split(" ")[0];
    command = command.slice(config.commandPrefix.length);
    let args = message.content.split(" ").slice(1);

    switch(command) {
        // Fun Shit
        case 'ripple':
            ripple(client, message, args);
            break;
        case 'track':
            track(client, message, args, socket);
            break;
        case 'map':
            map(client, message, args);
            break;
        case 'pp':
            pp(client, message, args);
            break;
    }
};

