import * as config from '../config/config.json';
import * as rippleAPI from 'rippleapi';
import * as axios from 'axios';
import * as Discord from 'discord.js';
import * as utils from '../utils/utils';

export async function topScore(client, scoreData) {
    try {
        if (!config.topScores.users.includes(scoreData.user.id)) return;

        // Get both the beatmap scores & beatmap info from the Ripple & osu! APIs
        const beatmapScores = await rippleAPI.getBeatmapScores(scoreData.beatmap_md5, 'mania');
        const response = await axios.get(`https://osu.ppy.sh/api/get_beatmaps?k=${config.osuAPIKey}&h=${scoreData.beatmap_md5}`)

        // Go through all of the scores and figure out if the score is in the top 10.
        for (let i = 0; i < beatmapScores.scores.length; i++) {
            if (scoreData.id == beatmapScores.scores[i].id && i <= 10) {
                // Send Embed to Discord Server
                const channel = client.channels.get(config.topScores.channel);
                return await channel.sendEmbed(getTopScoreEmbed(scoreData, response.data[0], i));
            }
        }

    } catch (err) {
        console.log(err)
    }
}


// Returns an instance of the Discord RichEmbed class with the top score data.
const getTopScoreEmbed = (scoreData, beatmap, leaderboardRank) => {
    const hex = utils.randomHex();

    return new Discord.RichEmbed()
        .setTitle(`New ${utils.addCommas(Math.round(scoreData.pp))}pp (#${leaderboardRank + 1}) score submitted by: ${scoreData.user.username}`)
        .setColor(hex)
        .setThumbnail(`https://a.ripple.moe/${scoreData.user.id}`)
        .addField(`Beatmap`, `[${beatmap.artist} - ${beatmap.title} [${beatmap.version}] (${beatmap.creator})](https://osu.ppy.sh/b/${beatmap.beatmap_id})`, false)
        .addField(`Profile`, `[Profile](https://ripple.moe/u/${scoreData.user.id})`, true)
        .addField(`Replay`, `[Replay](https://ripple.moe/web/replays/${scoreData.id})`, true)
        .addField(`Score`, `${utils.addCommas(scoreData.score)}/${(Math.floor(scoreData.accuracy * 100) / 100)}% ${scoreData.rank}`, true)
        .addField('Accuracy Spread', `${utils.addCommas(scoreData.max_combo)}x/${utils.addCommas(scoreData.count_geki)}/${utils.addCommas(scoreData.count_300)}/${utils.addCommas(scoreData.count_katu)}/${utils.addCommas(scoreData.count_100)}/${utils.addCommas(scoreData.count_50)}/${utils.addCommas(scoreData.count_miss)}`, true);
};
