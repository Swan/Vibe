const Discord = require('discord.js');
const rippleAPI = require('rippleAPI');
const config = require('../config/config.json');

module.exports.newScore = async (client, newScoreData) => {
    const userInfo = await rippleAPI.getUserById(newScoreData.user_id);
    const userRecentScores = await rippleAPI.getUserRecent(userInfo.username, 'mania');
    const beatmapInfo = userRecentScores.scores[0];

    client.channels.get(config.trackingChannel)
        .sendEmbed(new Discord.RichEmbed()
            .setTitle(`New ${addCommas(Math.trunc(newScoreData.pp))}pp score submitted by: ${userInfo.username}`)
            .setColor(0x73C383)
            .setThumbnail(`https://a.ripple.moe/${newScoreData.user_id}`)
            .addField('Details', `User: **${userInfo.username}** has submitted a **${addCommas(Math.trunc(newScoreData.pp))}pp** score!`, false)
            .addField('Beatmap', `[${beatmapInfo.beatmap.song_name}](https://eggplants.org/b/${beatmapInfo.beatmap.beatmap_id})`, false)
            .addField('Profile', `[Profile](https://ripple.moe/u/${newScoreData.user_id}})`, true)
            .addField('Replay', `[Replay](https://ripple.moe/web/replays/${newScoreData.id})`, true)
            .addField('PP', `${addCommas(Math.trunc(newScoreData.pp))}`, true)
            .addField('Accuracy', `${newScoreData.accuracy}%`, true)
            .addField('Rank', `${newScoreData.rank}`, true)
            .addField('Score', `${addCommas(newScoreData.score)}`, true)
            .addField('Max Combo', `${addCommas(newScoreData.max_combo)}`, true)
            .addField('Full Combo', `${newScoreData.full_combo}`, true)
            .addField('MAX 300s', `${addCommas(newScoreData.count_geki)}`, true)
            .addField('300s', `${addCommas(newScoreData.count_300)}`, true)
            .addField('200s', `${addCommas(newScoreData.count_katu)}`, true)
            .addField('100s', `${addCommas(newScoreData.count_100)}`, true)
            .addField('50s', `${addCommas(newScoreData.count_50)}`, true)
            .addField('Misses', `${addCommas(newScoreData.count_miss)}`, true))
};

const addCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}