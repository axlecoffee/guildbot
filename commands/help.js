const Discord = require('discord.js')
const {MessageButton, MessageActionRow, ButtonCollector} = require('discord-buttons');
const db = require('../stormdb.js')

module.exports.run = async (client, message, args, config) => {
    let buttonFoward = new MessageButton()
        .setStyle(2)
        .setEmoji('▶️')
        .setLabel('')
        .setID('help_menu_fowards')
    let buttonBackwards = new MessageButton()
        .setStyle(2)
        .setEmoji('◀️')
        .setLabel('')
        .setID('help_menu_backwards')
    let row = new MessageActionRow()
        .addComponent(buttonBackwards)
        .addComponent(buttonFoward)
    
    const embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.b)
        .setTimestamp()
        .addField("**Help menu.**", "Comming soon.")
    

    
    message.channel.send({embed: embed, component: row})
}

module.exports.help = async () => {
    return {
        name: "Help menu",
        desc: "Shows you this help menu.",
        args: "",
        category: "misc"
    }
}