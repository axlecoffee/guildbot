const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')
const db = require('../stormdb.js')

module.exports = {
    help: true,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`Show useful information about the bot.`),
    async execute(client, interaction) {
        let buttonFoward = new Discord.MessageButton()
            .setStyle(2)
            .setEmoji('▶️')
            .setCustomId('help_menu_1')
        let buttonBackwards = new Discord.MessageButton()
            .setStyle(2)
            .setEmoji('◀️')
            .setCustomId('help_menu_backwards')
            .setDisabled(true)
        let row = new Discord.MessageActionRow()
            .addComponents(buttonBackwards, buttonFoward)
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        const embed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.b)
            .setTimestamp()
            .setTitle(`**GuildBot v${config.version}**`)
            .addField("Uptime", `:clock2: ${days}d ${hours}h ${minutes}m ${seconds}s`, true)
            .addField("Servers", `:shield: ${client.guilds.cache.size}`, true)
            .addField("Channels", `:file_folder: ${client.channels.cache.size}`, true)
            .addField("Users", `:bust_in_silhouette: ${client.users.cache.size}`, true)
            .addField("Emoji", `<:KannaSip:889543061821063189> ${client.emojis.cache.size}`, true)
            .addField("Commands ran", `<:slash:913172347639435285> ${db.get(`stat`).get(`countCommands`).value()}`, true)
            .addField("Buttons pressed", `<:button:913172562001928193> ${db.get(`stat`).get(`countButtons`).value()}`, true)
            .addField("Select menu's used", `<:dropdown_select:914106174754947113> ${db.get(`stat`).get(`countSelectMenu`).value()}`, true)
            .addField("Guild Applications Submitted", `:pencil: ${db.get(`stat`).get(`countGuildApplications`).value()}`, true)
            .addField("Bot repository", `<:github:888155742719328276> [GitHub](https://github.com/MCUniversity/guildbot)`, true)
            .addField("Bot library", "[**Discord.js v13**](https://discord.js.org/#/docs/main/)", true)
            .addField("Created on", `${client.user.createdAt}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter('Developed by @MCUniversity#0859')
        interaction.reply({
            embeds: [embed],
            components: [row],
            allowedMentions: {
                repliedUser: false
            }
        })
    },
};