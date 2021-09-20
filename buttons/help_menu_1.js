const Discord = require('discord.js')
const {MessageButton,MessageActionRow,ButtonCollector} = require('discord-buttons');

module.exports.run = async (client, button, config) => {
    let buttonFoward = new MessageButton()
        .setStyle(2)
        .setEmoji('▶️')
        .setLabel('')
        .setID('help_menu_2')
    let buttonBackwards = new MessageButton()
        .setStyle(2)
        .setEmoji('◀️')
        .setLabel('')
        .setID('help_menu_0')
    let row = new MessageActionRow()
        .addComponent(buttonBackwards)
        .addComponent(buttonFoward)

    button.reply.defer()
    let message = button.message

    const embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.b)
        .setTimestamp()
        .setTitle("Commands:")
        .addField("*help", "Shows this menu.", true)
        .addField("*ping", "Check the bot's ping (in miliseconds). Useful to check if the bot is online and responsive.", true)
        .addField("*link", "System for linking minecraft accounts to discord accounts to verify ownership of account and more. Run command for more info.", true)
        .addField("*apply", "Apply for membership in the guild or to join the guild's staff team.", true)
        .setFooter('Developed by @MCUniversity#0859')
    message.edit({
        embed: embed,
        component: row
    });
}