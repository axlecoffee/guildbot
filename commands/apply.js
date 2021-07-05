const Discord = require('discord.js')
const {MessageButton, MessageActionRow} = require('discord-buttons');
const db = require('../stormdb.js')

module.exports.run = async (client, message, args, config) => {
    let guildmemberbutton = new MessageButton()
        .setStyle(1)
        .setEmoji('📇')
        .setLabel('Guild membership application')
        .setID('apply_guild_member')
    let guildstaffbutton = new MessageButton()
        .setStyle(1)
        .setEmoji('👮')
        .setLabel('Staff application')
        .setID('apply_guild_staff')
    let row = new MessageActionRow()
        .addComponent(guildmemberbutton)
        .addComponent(guildstaffbutton)
    let embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.a)
        .setTimestamp()
        .addField('**Guild applications**', 'Select what application you want to fill.')
    
    let m = await message.channel.send({
        embed: embed,
        component: row
    })
}

module.exports.help = async () => {
    return {}
}