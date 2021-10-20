const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    help: true,
    data: new SlashCommandBuilder()
        .setName('apply')
        .setDescription(`List of available guild applications.`),
    async execute(client, interaction) {
        let guildmemberbutton = new Discord.MessageButton()
            .setStyle(1)
            .setEmoji('📇')
            .setLabel('Guild membership application')
            .setCustomId('apply_guild_member')
        let guildstaffbutton = new Discord.MessageButton()
            .setStyle(1)
            .setEmoji('👮')
            .setLabel('Staff application')
            .setCustomId('apply_guild_staff')
        let row = new Discord.MessageActionRow()
            .addComponents(guildmemberbutton, guildstaffbutton)
        let embed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
            .addField('**Guild applications**', 'Select an application.')
        interaction.reply({
            embeds: [embed],
            components: [row],
            allowedMentions: {
                repliedUser: false
            }
        })
    },
};