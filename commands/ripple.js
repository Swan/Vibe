import { randomColor } from 'randomcolor';

export async function ripple(client, message, args) {
    try {
        if (args.length == 0) return await message.reply("Please specify the user you want me to lookup.");

        const username = args.join("%20");

        const channel = await client.channels.get(message.channel.id);
        const hex = randomColor().replace("#", "");
        return channel.sendMessage(`http://sig.ripple.moe/sig.php?colour=hex${hex}&uname=${username}&mode=3&pp=0&countryrank`);

    } catch (err) {
        console.log(err);
    }
}