const Discord = require('discord.js');
const wifipiano2 = require('wifipiano2');
const nodesu = require('nodesu');
const parser = require('osu-parser');
const download = require('download-file');
const fs = require('fs');
const config = require('../config/config.json');

module.exports.map = async (client, message, args) => {
    try {
        let beatmap = args[0];
        if (!beatmap.includes("osu.ppy.sh/b/")) return message.reply("You need to provide a valid osu! beatmap link. **/b/**");
        
        beatmap = beatmap.substring(beatmap.indexOf('/b/') + 3);
        if (beatmap.includes('&m=3')) beatmap = beatmap.replace('&m=3', '');

        const api = new nodesu.Client(config.osuAPIKey);
        let beatmapData = await api.beatmaps.getByBeatmapId(beatmap);
        beatmapData = beatmapData[0];

       if (beatmapData.mode != 3) return message.reply("I only take mania beatmaps, buddy.");

       let options  = {
           directory: './parsing/',
           filename: `${beatmap}.osu`
       };

       // Download beatmap.osu, parse it, and find the number of objects.  
       download(`http://osu.ppy.sh/osu/${beatmap}`, options, (err) => {
            if (err) return message.reply("Could not get pp data for that beatmap.");
            parser.parseFile(options.directory + options.filename, (err, bm) => {
                if (err) console.log(err);
                
                // Calculate pp for 90%, 95%, 98%, 99%, 100%
                let ninetyPercent = wifipiano2.calculate({
                        starRating: beatmapData.difficultyrating, 
                        overallDifficulty: beatmapData.diff_overall, 
                        objects: bm.hitObjects.length,
                        mods: 'none',
                        score: 680000,
                        accuracy: 90.00
                    });

                let ninetyFivePercent = wifipiano2.calculate({
                        starRating: beatmapData.difficultyrating, 
                        overallDifficulty: beatmapData.diff_overall, 
                        objects: bm.hitObjects.length,
                        mods: 'none',
                        score: 840000,
                        accuracy: 95.00
                    });

                let ninetyEightPercent = wifipiano2.calculate({
                        starRating: beatmapData.difficultyrating, 
                        overallDifficulty: beatmapData.diff_overall, 
                        objects: bm.hitObjects.length,
                        mods: 'none',
                        score: 920000,
                        accuracy: 98.00
                    });

                let ninetyNinePercent = wifipiano2.calculate({
                        starRating: beatmapData.difficultyrating, 
                        overallDifficulty: beatmapData.diff_overall, 
                        objects: bm.hitObjects.length,
                        mods: 'none',
                        score: 960000,
                        accuracy: 99.00
                    });

                let hundredPercent = wifipiano2.calculate({
                        starRating: beatmapData.difficultyrating, 
                        overallDifficulty: beatmapData.diff_overall, 
                        objects: bm.hitObjects.length,
                        mods: 'none',
                        score: 1000000,
                        accuracy: 100.00
                    });


                client.channels.get(message.channel.id)
                                .sendEmbed(new Discord.RichEmbed()
                                    .setTitle(`Displaying information for beatmap: ${beatmap}`)
                                    .setColor(0xDB88C2)
                                    .setThumbnail(`https://b.ppy.sh/thumb/${beatmapData.beatmapset_id}l.jpg`)
                                    .addField('Beatmap', `[${beatmapData.artist} - ${beatmapData.title} [${beatmapData.version}] (${beatmapData.creator})](https://osu.ppy.sh/b/${beatmap})`)
                                    .addField('Stars/BPM', `${(Math.floor(beatmapData.difficultyrating * 100) / 100)}*/${beatmapData.bpm}bpm`, true)
                                    .addField('PP', `**90%, 680k**: ${addCommas((Math.floor(ninetyPercent * 100) / 100))}pp \n` +
                                                    `**95%, 840k**: ${addCommas((Math.floor(ninetyFivePercent * 100) / 100))}pp \n` +
                                                    `**98%, 920k**: ${addCommas((Math.floor(ninetyEightPercent * 100) / 100))}pp \n`  +
                                                    `**99%, 960k**: ${addCommas((Math.floor(ninetyNinePercent * 100) / 100))}pp \n`  +                                          
                                                    `**100%, 1000k**: ${addCommas((Math.floor(hundredPercent * 100) / 100))}pp`, true))                
                })
                setTimeout(() => fs.unlinkSync(options.directory + options.filename), 5000);
       });

    } catch (e) {
        message.reply("Unable to get pp for the map you've given.");
        console.log(e);
    }
};

const addCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}