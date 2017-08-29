import * as config from '../config/config.json';
import * as axios from 'axios';
import * as parser from 'osu-parser';
import * as wifipiano2 from 'wifipiano2';
import * as Discord from 'discord.js';
import * as utils from '../utils/utils';
const download = require('download-file');
const fs = require('fs');

export async function checkMap(client, message, args) {
    try {
        let beatmap = args[0];
        if (!beatmap.includes("osu.ppy.sh/b/")) return await message.reply("You need to provide a valid osu beatmap link **/b/**");

        beatmap = beatmap.substring(beatmap.indexOf('/b/') + 3);

        const modeIdentifier = '&m=3';
        if (beatmap.includes(modeIdentifier)) beatmap = beatmap.replace(modeIdentifier, '');

        const response = await axios.get(`https://osu.ppy.sh/api/get_beatmaps?k=${config.osuAPIKey}&b=${beatmap}`);
        const bmData = response.data[0];

        if (bmData.mode != 3) return await message.reply("I only take mania beatmaps, sorry.");

        const beatmapPath = await downloadBeatmap(beatmap);
        const performancePoints = await getPerformancePoints(beatmapPath, bmData);

        // Delete the beatmap after getting the performance points data
        fs.unlinkSync(beatmapPath);

        // Send the data back to the discord server.
        const channel = client.channels.get(message.channel.id);
        channel.sendEmbed(getMapEmbed(bmData, performancePoints));

    } catch (err) {
        console.log(err);
        return await message.reply("Unable to get beatmap data.");
    }
}


// Downloads a .osu file from the osu! website and resolves a file path. 
const downloadBeatmap = (beatmap) => {
    return new Promise((resolve, reject) => {
        const options = {
            directory: './parsing/',
            filename: `${beatmap}.osu`
        };

        download(`https://osu.ppy.sh/osu/${beatmap}`, options, (err) => {
            if (err) reject(err);

            // If all is well with the download, resolve the promise with the .osu file path.
            resolve(options.directory + options.filename);     
        });
    });
};


// Takes a mania .osu file and calculates the performance points for 100% Accuracy + 1000k Score.
const getPerformancePoints = (beatmapPath, beatmapData) => {
    return new Promise((resolve, reject) => {
        parser.parseFile(beatmapPath, (err, beatmap) => {
            if (err) reject(err);

            const performancePoints = wifipiano2.calculate({
                starRating: beatmapData.difficultyrating,
                overallDifficulty: beatmapData.diff_overall,
                objects: beatmap.hitObjects.length,
                mods: 'none',
                score: 1000000,
                accuracy: 100.00
            });

            resolve(Math.round(performancePoints));
        });
    });
};


// Compiles the beatmap and performance points data into a Discord RichEmbed
const getMapEmbed = (beatmapData, pp) => {
    const hex = utils.randomHex();
    return new Discord.RichEmbed()
        .setTitle(`Displaying information for beatmap: ${beatmapData.beatmap_id}`)
        .setColor(hex)
        .setThumbnail(`https://b.ppy.sh/thumb/${beatmapData.beatmapset_id}l.jpg`)
        .addField('Beatmap', `[${beatmapData.artist} - ${beatmapData.title} [${beatmapData.version}] (${beatmapData.creator})](https://osu.ppy.sh/b/${beatmapData.beatmap_id})`)
        .addField('Stars/BPM', `${(Math.floor(beatmapData.difficultyrating * 100) / 100)}*/${beatmapData.bpm}bpm`, true)       
        .addField('Max Performance Points', `**${pp}pp**`, true)
        .addField(`Keys`, `**${beatmapData.diff_size}**`, true)
        .addField(`Favorites`, `**${beatmapData.favourite_count}**`, true)
        .addField(`Tags`, `**${beatmapData.tags}**`);
};