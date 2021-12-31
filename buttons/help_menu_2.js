const Discord = require('discord.js')
const {MessageButton,MessageActionRow} = require('discord.js');
const config = require('../config.json')

module.exports.run = async (client, button) => {
    let buttonFoward = new MessageButton()
        .setStyle(2)
        .setEmoji('▶️')
        .setLabel('')
        .setCustomId('help_menu_fowards')
        .setDisabled(true)
    let buttonBackwards = new MessageButton()
        .setStyle(2)
        .setEmoji('◀️')
        .setLabel('')
        .setCustomId('help_menu_1')
    let row = new MessageActionRow()
        .addComponents(buttonBackwards, buttonFoward)

    const embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.b)
        .setTimestamp()
        .setTitle("Found a bug? Have a feature request? Need help?")
        .setDescription(`<:DiscordLogoWhite:888158984475918368> [Support server](https://discord.gg/${config.repo.supportServerInviteCode})\n<:github:888155742719328276> [GitHub](https://github.com/MCUniversity/guildbot)`)
        .setFooter('Developed by @MCUniversity#0859')
    button.update({
        embeds: [embed],
        components: [row]
    });
}