const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    async execute(client, interaction) {
        let nembed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
            .addField('**Guild applications**', `**Staff application**\nTo apply for a staff position, fill in [this form](${config.url.guild_staff_application}).`)
        interaction.update({
            embeds: [nembed],
            components: []
        });
    }
}