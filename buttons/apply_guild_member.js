const Discord = require('discord.js')
const {
    MessageButton,
    MessageActionRow
} = require('discord-buttons');

module.exports.run = async (client, button, config) => {
    button.reply.defer()
    let message = button.message
    let nembed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.a)
        .setTimestamp()
    if (message.channel.type == 'text' && message.channel.name.startsWith('ticket-')) {
        nembed.addField('Do you agree with the following:', `**1.** I can be active at least twice a week\n**2.** My Hypixel network level is 50 or higher\n**3.** I can contribute at least 100k guild exp per week`)
            let yesbutton = new MessageButton()
                .setStyle(1)
                .setEmoji('865975626774609920') //865887075509338122
                .setLabel('Yes')
                .setID('application_guild_member_yes')
            let nobutton = new MessageButton()
                .setStyle(1)
                .setEmoji('865975626325295135') //865887075491643402
                .setLabel('No')
                .setID('application_guild_member_no')
            let row = new MessageActionRow()
                .addComponent(yesbutton)
                .addComponent(nobutton)
            message.edit({
                embed: nembed,
                component: row
            });
        
    } else {
        nembed.addField('**Guild applications**', `**Guild membership application**\nTo join the guild, create a ticket and run the command again.`)
        message.edit({
            embed: nembed,
            component: null
        });
    }
}