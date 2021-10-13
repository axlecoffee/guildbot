const Discord = require('discord.js')

module.exports.run = async (client, message, args, config) => {
    message.reply({content: 'nu.', allowedMentions: { repliedUser: false }})
}