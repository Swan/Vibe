const Discord = require('discord.js');
const rippleAPI = require('rippleapi');

module.exports.ripple = async (client, message, args) => {
    try {
        if (typeof args[0] == 'string') {
            const response = await rippleAPI.getFullUserByName(args[0]);
            let embed = getEmbed(response);
            client.channels.get(message.channel.id).sendEmbed(embed);
        }
    } catch (e) {
        message.reply("Excuse me, sir. That user doesn't exist on Ripple.");
    }
};

const getEmbed = (userResponse) => {
    let embed = new Discord.RichEmbed()
        .setTitle(`Ripple Information for user: ${userResponse.username}`)
        .setColor(0x44B6EC)
        .setThumbnail(`https://a.ripple.moe/${userResponse.id}`)
        .setTimestamp()
        .addField('Details', `Showing Ripple profile details for user: **${userResponse.username}**`, false)        
        .addField('Username/Rank', `**${userResponse.username} / #${addCommas(userResponse.mania.global_leaderboard_rank)}**`, true)
        .addField('Country', `:flag_${userResponse.country.toLowerCase()}: **#${addCommas(userResponse.mania.country_leaderboard_rank)}**`, true)
        .addField('PP', addCommas(userResponse.mania.pp), true)
        .addField('Ranked Score', addCommas(userResponse.mania.ranked_score), true)
        .addField('Total Score', addCommas(userResponse.mania.total_score), true)
        .addField('Playcount', addCommas(userResponse.mania.playcount), true)
        .addField('Replays Watched', addCommas(userResponse.mania.replays_watched), true)
        .addField('Total Hits', addCommas(userResponse.mania.total_hits), true) 

    return embed;
};

const addCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}