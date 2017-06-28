const Discord = require('discord.js');
const nodesu = require('nodesu');
const moment = require('moment');
const config = require('../config/config.json');
const tracking = require('../config/tracking.json');

module.exports.trackMaps = async (client) => {

    // Every timeoutTime milliseconds, look for each user on the osu! API and see if
    // they've submitted or updated a map in the past timeoutTime milliseconds
    let timeoutTime = 60000;

    while(true) {
        let currentTime = new moment();

        for (let i = 0; i < tracking.mapTracking.length; i++) {
            const api = new nodesu.Client(config.osuAPIKey);
            let user = await api.user.get(tracking.mapTracking[i]);
            
            let userObject = {
                id: user.user_id,
                username: user.username,
                recentEvent: user.events[0]
            }
            
            // Go to the next person if their last activity doesn't have to do with submitting or updating beatmaps
            if (typeof userObject.recentEvent == 'undefined') continue;
            
            // Determine if whether their most recent even was a submission or an update.
            userObject.updatedOrSubmitted = userObject.recentEvent.display_html.includes("updated") ? 'updated' : 'submitted';


            let recentTime = new moment(userObject.recentEvent.date);

            // Because ppy stores dates 12 hours ahead. This will change depending on ur time zone.
            recentTime = recentTime.subtract(12, 'hours'); 

            // If the user has updated or submitted a map in the current timeout period, it'll be considered as new.
            let dateDifference = currentTime - recentTime;
            if (dateDifference <= timeoutTime) {
                // Get data about that particular beatmap.
                const beatmapData = await api.beatmaps.getBySetId(userObject.recentEvent.beatmapset_id);

                // Send To Discord
                client.channels.get(config.mapTrackingChannel)
                    .sendEmbed(new Discord.RichEmbed()
                        .setTitle(`${userObject.username} has ${userObject.updatedOrSubmitted} a beatmap!`)
                        .setColor(0xF961EF)
                        .setTimestamp()
                        .setThumbnail(`https://b.ppy.sh/thumb/${userObject.recentEvent.beatmapset_id}l.jpg`)
                        .addField(`Beatmap`, `[${beatmapData[0].artist} - ${beatmapData[0].title} (${beatmapData[0].creator})](https://osu.ppy.sh/s/${userObject.recentEvent.beatmapset_id})`)
                        .addField(`Tags`, `"${beatmapData[0].tags}"`));
            } 
        }
        await timeout(timeoutTime);
    }

};

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}