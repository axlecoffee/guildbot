const Discord = require('discord.js')

module.exports.run = async (client, button, config) => {
    let nembed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
            .addField('**Guild applications**', `**Staff application**\nTo apply for a staff position, fill in [this form](${config.links.guild_staff_application}).`)
    button.update({
        embeds: [nembed],
        components: []
    });
}