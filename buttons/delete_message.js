const Discord = require('discord.js')
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');

module.exports.run = async (client, button, config) => {
    let message = button.message
    message.delete()
    button.reply({content: "Deleted.", ephemeral: true})
}