const Discord = require('discord.js');
const rippleAPI = require('rippleapi');
const config = require('../config/config.json');

module.exports.newScore = async (client, newScoreData) => {
    const userInfo = await rippleAPI.getUserById(newScoreData.user_id);
    const userRecentScores = await rippleAPI.getUserRecent(userInfo.username, 'mania');
    const beatmapScores = await rippleAPI.getBeatmapScores(newScoreData.beatmap_md5, 'mania');
    const beatmapInfo = userRecentScores.scores[0];

    for (let i = 0; i <= 10; i++) {
        if (typeof beatmapScores.scores[i].id != 'undefined' && beatmapScores.scores[i].id == newScoreData.id) {
            client.channels.get(config.trackingChannel)
                .sendEmbed(new Discord.RichEmbed()
                    .setTitle(`New ${addCommas(Math.trunc(newScoreData.pp))}pp score submitted by: ${userInfo.username}`)
                    .setColor(0x73C383)
                    .setThumbnail(`https://a.ripple.moe/${newScoreData.user_id}`)
                    .addField('Details', `User: **${userInfo.username}** has submitted a **${addCommas(Math.trunc(newScoreData.pp))}pp** score!`, false)
                    .addField('Beatmap', `[${beatmapInfo.beatmap.song_name}](https://eggplants.org/b/${beatmapInfo.beatmap.beatmap_id})`, false)
                    .addField('Profile', `[Profile](https://ripple.moe/u/${newScoreData.user_id})`, true)
                    .addField('Replay', `[Replay](https://ripple.moe/web/replays/${newScoreData.id})`, true)
                    .addField('PP', `${addCommas(Math.trunc(newScoreData.pp))}`, true)
                    .addField('Rank/Acc/Score/Combo', `${newScoreData.rank}/${newScoreData.accuracy}%/${addCommas(newScoreData.score)}/${addCommas(newScoreData.max_combo)}`, true)
                    .addField('Acc Spread', `${addCommas(newScoreData.count_geki)}/${addCommas(newScoreData.count_300)}/${addCommas(newScoreData.count_katu)}/${addCommas(newScoreData.count_100)}/${addCommas(newScoreData.count_50)}/${addCommas(newScoreData.count_miss)}`, true))
        }
    }


};

const addCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
