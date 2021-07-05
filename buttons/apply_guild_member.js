const Discord = require('discord.js')

module.exports.run = async (client, button, config) => {
    button.defer()
    let message = button.message
    let nembed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
            .addField('**Guild applications**', `**Guild membership application**\nTo join the guild, fill in [this form](${config.links.guild_membership_application}).`)
    message.edit({
        embed: nembed,
        component: null
    });
}