const Discord = require('discord.js')

module.exports.run = async (client, button, config) => {
    let message = button.message
    let embed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
            .addField("Account linking system.", "**This system is in place to make applying to join the guild easier. It links your discord account with your minecraft account.\nCommands:**\n\*link help - Open this menu\n\*link check [ID] - Check your own status, or the status of another person\n\*link update <IGN> - Create/update the minecraft account linked to your discord account.\n\*link tutorial - Shows a gif with the tutorial on how to link your discord")
            .setFooter('[Optional parameter] | <Required parameter>')
    button.reply.send({embed: embed, files: [{
        attachment: './discord_link_tutorial.gif',
        name: 'tutorial.gif'
    }]})
    /* message.edit({
        embed: nembed,
        component: null
    }); */
}