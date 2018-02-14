import * as config from '../config/config.json';

export async function iam(client, message, args) {
    if (args.length < 1) return message.reply("You can either do `;iam vibro` or ;iamnot vibro");

    if (args[0].toLowerCase() != "vibro")
        return;

    try {
        const target = message.guild.member(message.author);
        await target.addRole(config.roles.vibro);
        await target.removeRole(config.roles.notVibro);

    } catch (err) {
        console.log(err);
        await message.reply("I couldn't complete your request, sorry.");
    }
}

export async function iamnot(client, message, args) {
    if (args.length < 1) return message.reply("You can either do `;iam vibro` or ;iamnot vibro");

    if (args[0].toLowerCase() != "vibro")
        return;

    try {
        const target = message.guild.member(message.author);
        await target.removeRole(config.roles.vibro);
        await target.addRole(config.roles.notVibro);

    } catch (err) {
        console.log(err);
        await message.reply("I couldn't complete your request, sorry.");
    }
}