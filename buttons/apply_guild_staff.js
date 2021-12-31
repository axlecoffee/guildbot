const Discord = require('discord.js')
const config = require('../config.json')

module.exports.run = async (client, button) => {
    let nembed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
            .addField('**Guild applications**', `**Staff application**\nTo apply for a staff position, fill in [this form](${config.url.guild_staff_application}).`)
    button.update({
        embeds: [nembed],
        components: []
    });
}