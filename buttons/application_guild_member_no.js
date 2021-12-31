const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, button) => {
    let nembed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.a)
        .setTimestamp()
        .setTitle(`We're sorry but you do not meet the requirements to join the guild.`)
    button.update({
        embeds: [nembed],
        components: []
    });
    const logembed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTimestamp()
        .setAuthor(button.user.tag)
        .setThumbnail(button.user.displayAvatarURL())
        .addField('**Failed application**', '**Questions 1-3 (requirements):**\nUser anwsered **NO**.\n**Question 4 (IGN):**\nNot checked.')
    channel = client.channels.cache.get(config.channels.appLogChannelId)
    channel.send({embeds: [logembed]})
}