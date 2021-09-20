const Discord = require('discord.js')
const {MessageButton,MessageActionRow,ButtonCollector} = require('discord-buttons');

module.exports.run = async (client, button, config) => {
    let buttonFoward = new MessageButton()
        .setStyle(2)
        .setEmoji('▶️')
        .setLabel('')
        .setID('help_menu_fowards')
        .setDisabled(true)
    let buttonBackwards = new MessageButton()
        .setStyle(2)
        .setEmoji('◀️')
        .setLabel('')
        .setID('help_menu_1')
    let row = new MessageActionRow()
        .addComponent(buttonBackwards)
        .addComponent(buttonFoward)

    button.reply.defer()
    let message = button.message

    const embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.b)
        .setTimestamp()
        .setTitle("Found a bug? Have a feature request? Need help?")
        .setDescription(`<:DiscordLogoWhite:888158984475918368> [Support server](https://discord.gg/${config.supportServerInviteCode})\n<:github:888155742719328276> [GitHub](https://github.com/MCUniversity/guildbot)`)
        .setFooter('Developed by @MCUniversity#0859')
    message.edit({
        embed: embed,
        component: row
    });
}