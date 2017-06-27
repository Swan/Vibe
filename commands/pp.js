const Discord = require('discord.js');
const wifipiano2 = require('wifipiano2');

module.exports.pp = (client, message, args) => {

    if (args.length < 3) return message.reply("Please use the format `;pp (stars) (od) (# of objects)`");

    let stars = args[0];
    let od = args[1];
    let objectCount = args[2];

    let pp = wifipiano2.calculate({
            starRating: stars, 
            overallDifficulty: od, 
            objects: objectCount,
            mods: 'none',
            score: 1000000,
            accuracy: 100.00
        });    

    client.channels.get(message.channel.id)
        .sendMessage(`**Stars:** ${stars} | **OD:** ${od} | **Objects:** ${addCommas(objectCount)} | **PP:** ${addCommas((Math.floor(pp * 100) / 100))}`);

};

const addCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}