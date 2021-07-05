const Discord = require('discord.js')

module.exports.run = async (client, message, args, config) => {
    message.channel.send('nu.')
}

module.exports.help = async () => {
    return {
        name: "Nu command.",
        desc: "Nu.",
        args: ""
    }
}