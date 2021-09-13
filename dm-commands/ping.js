const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, message, args) => {
    let aembed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.b)
        .setTimestamp()
        .addField("**Ping**", `Please wait, calculating ping...`)
    const msg = await message.channel.send({embed: aembed});
    let embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.b)
        .setTimestamp()
        .addField("**Ping**", `${msg.createdTimestamp - message.createdTimestamp} ms`)
    msg.edit({embed: embed})
}