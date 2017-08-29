import * as wifipiano2 from 'wifipiano2';
import * as utils from '../utils/utils';

export async function pp(client, message, args) {
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
        .sendMessage(`**Stars:** ${stars} | **OD:** ${od} | **Objects:** ${utils.addCommas(objectCount)} | **PP:** ${utils.addCommas((Math.floor(pp * 100) / 100))}`);

}