const Discord = require('discord.js')
const {
    MessageButton,
    MessageActionRow
} = require('discord-buttons');

module.exports.run = async (client, button, config) => {
    button.reply.defer()
    let message = button.message
    message.delete()
}