const Discord = require('discord.js')
const {MessageButton, MessageActionRow} = require('discord.js');
const db = require('../stormdb.js')

module.exports.run = async (client, message, args, config) => {
    let guildmemberbutton = new MessageButton()
        .setStyle(1)
        .setEmoji('📇')
        .setLabel('Guild membership application')
        .setCustomId('apply_guild_member')
    let guildstaffbutton = new MessageButton()
        .setStyle(1)
        .setEmoji('👮')
        .setLabel('Staff application')
        .setCustomId('apply_guild_staff')
    let row = new MessageActionRow()
        .addComponents(guildmemberbutton, guildstaffbutton)
    let embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.a)
        .setTimestamp()
        .addField('**Guild applications**', 'Select what application you want to fill.')
    
    let m = await message.reply({
        embeds: [embed],
        components: [row], 
        allowedMentions: { repliedUser: false }
    })
}