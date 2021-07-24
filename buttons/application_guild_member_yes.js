const Discord = require('discord.js')
const {
    MessageButton,
    MessageActionRow
} = require('discord-buttons');
const db = require("../stormdb.js")

module.exports.run = async (client, button, config) => {
    button.defer()
    let message = button.message
    let userData;
    if (db.get(`accountLinks`).get(`${button.clicker.user.id}`).value() == undefined) {
        userData = undefined;
    } else {
        userData = db.get(`accountLinks`).get(`${button.clicker.user.id}`).get(`name`).value()
    }

    if (userData == undefined) {
        let undefinedEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTimestamp()
            .addField("<:error_emoji:868054485946224680> Minecraft account not linked!", "Your minecraft account is not linked to your discord account. You can fix this by running the **\*link update <IGN>** command.")
        let linkHelpButton = new MessageButton()
            .setStyle(1)
            .setEmoji('ℹ️')
            .setLabel('Learn more.')
            .setID('link_help_button')
        message.edit({
            embed: undefinedEmbed,
            component: linkHelpButton
        });
    } else {
        let sucessembed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
            .addField('Your application was submitted.', 'Thank you.')
        message.edit({
            embed: sucessembed,
            component: null
        });
        const logembed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .setAuthor(button.clicker.user.tag)
            .setThumbnail(button.clicker.user.displayAvatarURL())
            .addField('**Successful application**', `**Questions 1-3 (requirements):**\nUser anwsered **YES**.\n**Linked IGN:**\n*${userData}*`)
        channel = client.channels.cache.get(config.applogschannel)
        channel.send(logembed)
    }
}