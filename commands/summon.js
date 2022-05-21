const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.MONGO_URL)

module.exports = {
    help: false,
    data: new SlashCommandBuilder()
        .setName('summon')
        .setDescription(`Summons an object.`)
        .addSubcommand(command => command
            .setName('menu')
            .setDescription('Summon a dropdown menu')
            .addStringOption(option => 
                option
                    .setName('object')
                    .setDescription('Select and object you would like to summon.')
                    .setRequired(true)
                    .addChoice('Select menu for colour roles', 'colour')
                    .addChoice('Select menu for notification roles', 'pings')
            )
        )
        .addSubcommand(command => command
            .setName('kickwave')
            .setDescription('Summons an embed that calculates a kickwave.')
            .addBooleanOption(option => option
                .setName('ephemeral')
                .setDescription('If the reply should be ephemeral or not.')
                .setRequired(true)
                )
            .addIntegerOption(option => option
                .setName('count')
                .setDescription('Amount of users to consider (max 25).')
                .setRequired(true)
                )
            )
        ,
    async execute(client, interaction) {
        if (interaction.options.getSubcommand() == 'menu') {
            if (interaction.options.getString('object') == "colour") {
                const pink = {value: 'rr_pink', label: 'Pink', description: 'Get the pink role colour', emoji: '897544182959333407'}
                const purple = {value: 'rr_purple', label: 'Purple', description: 'Get the purple role colour', emoji: '897544182908985354'}
                const blue = {value: 'rr_blue', label: 'Blue', description: 'Get the blue role colour', emoji: '897544182938353684'}
                const aqua = {value: 'rr_aqua', label: 'Aqua', description: 'Get the aqua role colour', emoji: '897544183013867560'}
                const green = {value: 'rr_green', label: 'Green', description: 'Get the green role colour', emoji: '897544182875447357'}
                const yellow = {value: 'rr_yellow', label: 'Yellow', description: 'Get the yellow role colour', emoji: '897544183001264209'}
                const orange = {value: 'rr_orange', label: 'Orange', description: 'Get the orange role colour', emoji: '897544182938341446'}
                const red = {value: 'rr_red', label: 'Red', description: 'Get the red role colour', emoji: '897544182988693524'}
                const lightpink = {value: 'rr_lightpink', label: 'Light Pink', description: 'Get the light pink role colour', emoji: '897544182997086238'}
                const lightpurple = {value: 'rr_lightpurple', label: 'Light Purple', description: 'Get the light purple role colour', emoji: '897544182992871456'}
                const lightblue = {value: 'rr_lightblue', label: 'Light Blue', description: 'Get the light blue role colour', emoji: '897544182980296704'}
                const ultralightblue = {value: 'rr_ultralightblue', label: 'Ultra-Light Blue', description: 'Get the ultra light blue role colour', emoji: '897544182854467614'}
                const lightaqua = {value: 'rr_lightaqua', label: 'Light Aqua', description: 'Get the light aqua role colour', emoji: '897544182883827722'}
                const lightgreen = {value: 'rr_lightgreen', label: 'Light Green', description: 'Get the light green role colour', emoji: '897544182984499311'}
                const lightyellow = {value: 'rr_lightyellow', label: 'Light Yellow', description: 'Get the light yellow role colour', emoji: '897544182854463528'}
                const lightred = {value: 'rr_lightred', label: 'Light Red', description: 'Get the light red role colour', emoji: '897544183013855293'}
    
                const menu = new Discord.MessageSelectMenu()
                    .setPlaceholder("Select a colour role.")
                    .setCustomId("reactionroles")
                    .addOptions([pink, purple, blue, aqua, green, yellow, orange, red, lightpink, lightpurple, lightblue, ultralightblue, lightaqua, lightgreen, lightyellow, lightred])
                    .setMaxValues(16)
                    .setMinValues(0)
                const row = new Discord.MessageActionRow()
                    .addComponents(menu)
                interaction.channel.send({content: "​", components: [row]}) //ZERO-WIDTH SPACE
                interaction.reply({content: "Object summoned successfully.", ephemeral: true})
            } else if (interaction.options.getString('object') == "pings") {
                const updatePings = {value: 'rr_updates', label: 'Updates and announcements', description: 'Recieve a ping for important updates and announcements.', emoji: '📣'}
                const giveawayPings = {value: 'rr_giveaways', label: 'Giveaways', description: 'Recieve a ping for giveaways.', emoji: '🎉'}
                const lookingForParty = {value: 'rr_lfp', label: 'Looking for party', description: 'Get pinged by other players when they are looking for a party.', emoji: '797755651022913597'}
                const menu = new Discord.MessageSelectMenu()
                    .setPlaceholder("Select a notification role")
                    .setCustomId("pingingroles")
                    .addOptions([updatePings, giveawayPings, lookingForParty])
                    .setMaxValues(3)
                    .setMinValues(0)
                const row = new Discord.MessageActionRow()
                    .addComponents(menu)
                interaction.channel.send({content: "​", components: [row]}) //ZERO-WIDTH SPACE
                interaction.reply({content: "Object summoned successfully.", ephemeral: true})
            }
        } else if (interaction.options.getSubcommand() == 'kickwave') {
            //Calculate players who contributed the least in the last 7 days.
            await MongoClient.connect()
            const db = MongoClient.db()
            db.collection('hypixel-api-data').findOne({ sid: "guild-leaderboard-data" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    interaction.reply({content:"You can't do this now. Please try again later.", ephemeral: true})
                    MongoClient.close()
                } else {
                    let lastUpdateTimestamp = res.timestamp;
                    let nowTimestamp = Date.now()
                    let totalSeconds = ((nowTimestamp-lastUpdateTimestamp) / 1000);
                    totalSeconds %= 86400; totalSeconds %= 3600;
                    let minutes = Math.floor(totalSeconds / 60);
                    let seconds = Math.floor(totalSeconds % 60);
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Kickwave calculation`)
                        .setColor(config.colours.secondary)
                        .setFooter(`Data last updated ${minutes}min ${seconds}sec ago.`)
                    content = "```json\n[\n"
                    let leaderBoardData = res.data
                    let arrData = Object.entries(leaderBoardData)
                    arrData.sort(function (a, b) {
                        return a[1].total - b[1].total;
                    });
                    let count = interaction.options.getInteger('count')
                    if (count > 25) count = 25;
                    if (count > arrData.length) count = arrData.length;
                    for (let i = 0;i<count;i++) {
                        let userData = arrData[i];
                        embed.addField(`**${userData[1].rankName}** - *${userData[0]}*`, `Total: *${userData[1].total.toLocaleString("en")} exp*\nAverage daily: *${((Math.floor(userData[1].avg*100))/100).toLocaleString("en")} exp*`, true)
                        if (i+1<count) {content+=`"${userData[0]}",\n`} else {content+=`"${userData[0]}"\n]`}
                    }
                    content+="\n```"
                    interaction.reply({ephemeral: interaction.options.getBoolean('ephemeral'), embeds: [embed], content: content}).then(()=>{
                        MongoClient.close()
                    })
                }    
            })
        }
    },
};