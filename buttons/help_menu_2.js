const Discord = require('discord.js')
const config = require('../config.json')

module.exports = { 
    async execute(client, interaction) {
        let buttonFoward = new Discord.MessageButton()
            .setStyle(2)
            .setEmoji('▶️')
            .setLabel('')
            .setCustomId('help_menu_fowards')
            .setDisabled(true)
        let buttonBackwards = new Discord.MessageButton()
            .setStyle(2)
            .setEmoji('◀️')
            .setLabel('')
            .setCustomId('help_menu_1')
        let row = new Discord.MessageActionRow()
            .addComponents(buttonBackwards, buttonFoward)
        const embed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.b)
            .setTimestamp()
            .setTitle("Found a bug? Have a feature request? Need help?")
            .setDescription(`<:DiscordLogoWhite:888158984475918368> [Support server](https://discord.gg/${config.repo.supportServerInviteCode})\n<:github:888155742719328276> [GitHub](https://github.com/MCUniversity/guildbot)`)
            .setFooter('Developed by @MCUniversity#0859')
        interaction.update({
            embeds: [embed],
            components: [row]
        });
    }
}