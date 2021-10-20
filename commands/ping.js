const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')

const getTimestampFromID = async (discordId) => {
    return (discordId / 4194304 + 1420070400000)
}

module.exports = {
    help: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(`View the bot's latency.`),
    async execute(client, interaction) {
        let aembed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.b)
            .setTimestamp()
            .addField("**Ping**", `Please wait, calculating ping...`)
        await interaction.reply({embeds: [aembed], allowedMentions: {repliedUser: false}, fetchReply: true})
            .then(async (message) => {
                let messageTimestamp = message.createdTimestamp
                let interactionTimestamp = await getTimestampFromID(interaction.id)
                let embed = new Discord.MessageEmbed()
                    .setColor(config.embedcolour.b)
                    .setTimestamp()
                    .addField("**Ping**", `${Math.round(messageTimestamp) - Math.round(interactionTimestamp)} ms`)
                interaction.editReply({embeds: [embed]})
            })
    },
};