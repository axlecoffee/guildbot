const Discord = require('discord.js')
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');
const config = require('../config.json')
const pkg = require('../package.json')
require('dotenv').config()
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.MONGO_URL)

module.exports.run = async (client, button) => {
    let buttonFoward = new MessageButton()
        .setStyle(2)
        .setEmoji('▶️')
        .setLabel('')
        .setCustomId('help_menu_1')
    let buttonBackwards = new MessageButton()
        .setStyle(2)
        .setEmoji('◀️')
        .setLabel('')
        .setCustomId('help_menu_backwards')
        .setDisabled(true)
    let row = new MessageActionRow()
        .addComponents(buttonBackwards, buttonFoward)

    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    await MongoClient.connect()
    const db = MongoClient.db()
    db.collection('statistics').find({}).toArray(function (err, res) {
        if (err) throw err;
        let countCommands = res.find(obj => obj.sid === 'countCommands'); if (countCommands==null) {countCommands = 0} else {countCommands = countCommands.value};
        let countButtons = res.find(obj => obj.sid === 'countButtons'); if (countButtons==null) {countButtons = 0} else {countButtons = countButtons.value};
        let countSelectMenu = res.find(obj => obj.sid === 'countSelectMenu'); if (countSelectMenu==null) {countSelectMenu = 0} else {countSelectMenu = countSelectMenu.value};
        let countGuildApplications = res.find(obj => obj.sid === 'countGuildApplications'); if (countGuildApplications==null) {countGuildApplications = 0} else {countGuildApplications = countGuildApplications.value};
        const embed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.b)
            .setTimestamp()
            .setTitle(`**GuildBot v${pkg.version}**`)
            .addField("Uptime", `:clock2: ${days}d ${hours}h ${minutes}m ${seconds}s`, true)
            .addField("Servers", `:shield: ${client.guilds.cache.size}`, true)
            .addField("Channels", `:file_folder: ${client.channels.cache.size}`, true)
            .addField("Users", `:bust_in_silhouette: ${client.users.cache.size}`, true)
            .addField("Emoji", `<:KannaSip:889543061821063189> ${client.emojis.cache.size}`, true)
            .addField("Commands ran", `<:slash:913172347639435285> ${countCommands}`, true)
            .addField("Buttons pressed", `<:button:913172562001928193> ${countButtons}`, true)
            .addField("Select menu's used", `<:dropdown_select:914106174754947113> ${countSelectMenu}`, true)
            .addField("Guild Applications Submitted", `:pencil: ${countGuildApplications}`, true)
            .addField("Bot repository", `<:github:888155742719328276> [GitHub](https://github.com/MCUniversity/guildbot)`, true)
            .addField("Bot library", "[**Discord.js v13**](https://discord.js.org/#/docs/main/)", true)
            .addField("Created on", `${client.user.createdAt}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter('Developed by @MCUniversity#0859')
        if (!button.guild.roles.everyone.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {
            if (!button.channel.permissionsFor(button.guild.roles.everyone).has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {
                embed.addField(':warning: External emoji could not be displayed!', 'For external emoji to be displayed properly within slash commands, the @everyone role in your server needs to have the "Use External Emoji" permission.')    
            }
        }
        if (!button.channel.permissionsFor(button.guild.roles.everyone).serialize().USE_EXTERNAL_EMOJIS && button.guild.roles.everyone.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {
            embed.addField(':warning: External emoji could not be displayed!', 'For external emoji to be displayed properly within slash commands, the @everyone role in your server needs to have the "Use External Emoji" permission.')    
        }
        button.update({
            embeds: [embed],
            components: [row]
        });
        MongoClient.close()
    });
}