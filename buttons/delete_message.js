const Discord = require('discord.js')
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');
const config = require('../config.json')

module.exports.run = async (client, button) => {
    let message = button.message
    message.delete()
    button.reply({content: "Deleted.", ephemeral: true})
}