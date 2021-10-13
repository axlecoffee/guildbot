const Discord = require('discord.js')
const {MessageButton,MessageActionRow} = require('discord.js');

module.exports.run = async (client, button, config) => {
    let buttonFoward = new MessageButton()
        .setStyle(2)
        .setEmoji('▶️')
        .setLabel('')
        .setCustomId('help_menu_2')
    let buttonBackwards = new MessageButton()
        .setStyle(2)
        .setEmoji('◀️')
        .setLabel('')
        .setCustomId('help_menu_0')
    let row = new MessageActionRow()
        .addComponents(buttonBackwards, buttonFoward)

    const embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.b)
        .setTimestamp()
        .setTitle("Commands:")
        .addField("*help", "Shows this menu.", true)
        .addField("*ping", "Check the bot's ping (in miliseconds). Useful to check if the bot is online and responsive.", true)
        .addField("*link", "System for linking minecraft accounts to discord accounts to verify ownership of account and more. Run command for more info.", true)
        .addField("*apply", "Apply for membership in the guild or to join the guild's staff team.", true)
        .setFooter('Developed by @MCUniversity#0859')
    button.update({
        embeds: [embed],
        components: [row]
    });
}