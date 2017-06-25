const Discord = require('discord.js');
const rippleAPI = require('rippleapi');

module.exports.track = async (client, message, args, socket) => {
    try {
        let userToTrack = args[0];

        let id;
        if (typeof userToTrack == 'string') {
            const response = await rippleAPI.getFullUserByName(userToTrack);
            id = response.id;      
        }

        let message = {type: 'subscribe_scores', data: [{user: id, mode: 3}]
        }
    } catch (e) {
        message.reply("Unfortunately that user doesn't exist on Ripple!");
    }
};