const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')
const https = require('https');
const db = require('../stormdb.js')

module.exports = {
    help: true,
    cooldown: 2000,
    data: new SlashCommandBuilder()
        .setName('guild')
        .setDescription(`Access data about the guild and its members.`)
        .addSubcommand(subcommand => subcommand
            .setName('checkuser')
            .setDescription("Fetch data about a user.")
            .addUserOption(option => option
                .setName('user')
                .setDescription('Discord username')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('leaderboard')
            .setDescription("Fetch the guild's exp leaderboard.")
        )
        .addSubcommand(subcommand => subcommand
            .setName('info')
            .setDescription("General guild statistics and information.")
        ),
    async execute(client, interaction) {
        if (interaction.options.getSubcommand() == 'checkuser') {
            let discordUser = interaction.options.getUser('user')
            let inGameName;
            if (db.get(`accountLinks`).get(`${discordUser.id}`).value() == undefined) {
                inGameName = undefined;
            } else {
                inGameName = db.get(`accountLinks`).get(`${discordUser.id}`).get(`name`).value()
            }
            if (inGameName == undefined) return interaction.reply({
                content: "**There was an error while executing this command!**\n*You must enter a discord user with a valid linked minecraft account (see the **/link** command)*",
                ephemeral: true
            })
            https.get(`https://api.hypixel.net/guild?key=${process.env.APIKEY}&id=${config.hypixelGuildId}`, (res) => {
                let data = "";
                let hGuild;
                res.on('data', data_chunk => {
                    data += data_chunk;
                })
                res.on('end', () => {
                    hGuild = JSON.parse(data)
                    if (hGuild.success) {
                        hGuild.guild.members.forEach(member => {
                            https.get(`https://sessionserver.mojang.com/session/minecraft/profile/${member.uuid}`, async (memberdata) => {
                                let mojangdata = "";
                                memberdata.on('data', data_chunk => {
                                    mojangdata += data_chunk;
                                })
                                memberdata.on('end', () => {
                                    mun = JSON.parse(mojangdata)
                                    if (mun.name == inGameName) {
                                        dates = Object.keys(member.expHistory)
                                        let dateField = ``
                                        dates.forEach((date) => {
                                            dateField += `**${date} - **${member.expHistory[date].toLocaleString("en")} exp\n`
                                        })
                                        https.get(`https://api.hypixel.net/player?key=${process.env.APIKEY}&uuid=${member.uuid}`, (res) => {
                                            let strData = "";
                                            res.on('data', data_chunk => {
                                                strData += data_chunk;
                                            })
                                            res.on('end', () => {
                                                let data = JSON.parse(strData)
                                                if (data.success != true) {console.error(data); return interaction.reply({content: `**There was an error while executing this command!**\n*No additional information available.*`, ephemeral: true})}
                                                let rank = "";
                                                if (data.player.monthlyPackageRank == "SUPERSTAR") {
                                                    rank = "MVP++"
                                                } else if (data.player.newPackageRank == "MVP_PLUS") {
                                                    rank = "MVP+"
                                                } else if (data.player.newPackageRank == "MVP") {
                                                    rank = "MVP"
                                                } else if (data.player.newPackageRank == "VIP_PLUS") {
                                                    rank = "VIP+"
                                                } else if (data.player.newPackageRank == "VIP") {
                                                    rank = "VIP"
                                                } else if (data.player.newPackageRank == "MVP") {
                                                    rank = "MVP"
                                                }
                                                let embed = new Discord.MessageEmbed()
                                                    .setColor(config.embedcolour.a)
                                                    .setTimestamp()
                                                    .setTitle(`**${rank}** ${inGameName} - Guild member data`)
                                                    .setFooter(`uuid: ${member.uuid}`)
                                                    .addField("Rank", `${member.rank}`)
                                                    .addField("Joined guild", `${new Date(member.joined)}`)
                                                    .addField("Exp history", dateField)
                                                let memberButton = new Discord.MessageButton()
                                                    .setStyle(1)
                                                    .setLabel('Guild member data')
                                                    .setCustomId('guildcommand_member')
                                                    .setDisabled(true)
                                                let userButton = new Discord.MessageButton()
                                                    .setStyle(1)
                                                    .setLabel('User data')
                                                    .setCustomId('guildcommand_user')
                                                let row = new Discord.MessageActionRow()
                                                    .addComponents(memberButton, userButton)
                                                interaction.reply({
                                                    content: `||{"uuid":"${member.uuid}","tag":"${discordUser.tag}"}||`,
                                                    embeds: [embed],
                                                    components: [row]
                                                })
                                            })
                                        }).on('error', (err) => {console.error(err); return interaction.reply({content: `**There was an error while executing this command!**\n*{${err}}*`, ephemeral: true})})
                                    }
                                })
                            }).on('error', (err) => {console.error(err); return interaction.reply({content: `**There was an error while executing this command!**\n*{${err}}*`, ephemeral: true})})
                        })
                    } else {
                        console.error(hGuild)
                    }
                })
            }).on('error', (err) => {console.error(err); return interaction.reply({content: `**There was an error while executing this command!**\n*{${err}}*`, ephemeral: true})})
        } else if (interaction.options.getSubcommand() == 'leaderboard') {
            //fetch from db - updates every 5 min
            let leaderboardData = db.get(`guildApiData`).get(`leaderBoardData`).value()
            let arrData = Object.entries(leaderboardData)
            arrData.sort(function (a, b) {
                return b[1].total - a[1].total;
            });
            let embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setColor(config.embedcolour.a)
                .setTitle("Weekly guild exp leaderboard")
                .setFooter("Data updated every 5 minutes.")
            for (let i = 0; i < 5; i++) {
                let userData = arrData[i];
                embed.addField(`**${userData[0]}**`, `Total: *${userData[1].total.toLocaleString("en")} exp*\nAverage daily: *${((Math.floor(userData[1].avg*100))/100).toLocaleString("en")} exp*`)
            }
            interaction.reply({
                embeds: [embed],
                allowedMentions: {
                    repliedUser: false
                }
            })

        } else if (interaction.options.getSubcommand() == 'info') {
            function capitalizeWords(str) {
                return str.replace(/\w\S*/g, function(text) {
                    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
                });
            }
            https.get(`https://api.hypixel.net/guild?key=${process.env.APIKEY}&id=${config.hypixelGuildId}`, (res) => {
                let strData = ""; let data;
                res.on('data', data_chunk => {
                    strData += data_chunk;
                })
                res.on('end', () => {
                    data = JSON.parse(strData)
                    if (data.success != true) {console.error(data); return interaction.reply({content: `**There was an error while executing this command!**\n*No additional information available.*`, ephemeral: true})}
                    let level;
                    if (data.guild.exp<100000) {level = 0;} else if (data.guild.exp<250000) {level = 1;} else if (data.guild.exp<500000) {level = 2;} else if (data.guild.exp<1000000) {level = 3;} else if (data.guild.exp<1750000) {level = 4} else if (data.guild.exp<2750000) {level = 5;} else if (data.guild.exp<4000000) {level = 6;} else if (data.guild.exp<5500000) {level = 7;} else if (data.guild.exp<7500000) {level = 8} else if (data.guild.exp >= 7500000) {if (data.guild.exp<15000000) {level = Math.floor((data.guild.exp - 7500000)/2500000)+9} else {level = Math.floor((data.guild.exp - 15000000)/3000000)+12}}
                    let games = data.guild.preferredGames.join(", "); games = games.replace("_", " "); games = capitalizeWords(games);
                    let joinable; if(data.guild.joinable) {joinable="Yes"} else {joinable="No"}
                    let publiclyListed; if(data.guild.publiclyListed) {publiclyListed="Yes"} else {publiclyListed="No"}
                    let mostPlayed = Object.entries(data.guild.guildExpByGameType)
                    mostPlayed.sort(function (a, b) {
                        return b[1] - a[1];
                    });
                    mostPlayedStr = ""
                    for (let i = 0;i<10;i++) {
                        mostPlayedStr+=capitalizeWords(mostPlayed[i][0].replace("_", " "))
                        if (i != 9) {mostPlayedStr+=", "}
                    }
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`**[${data.guild.tag}]** ${data.guild.name}`)
                        .setFooter(`uuid: ${data.guild._id}`)
                        .setTimestamp()
                        .setColor(config.embedcolour.a)
                        .addField(`Created on:`, `${new Date(data.guild.created)}`)
                        .addField(`Guild level:`, `${level}`)
                        .addField(`Guild members:`, `${data.guild.members.length}`)
                        .addField(`Guild coins:`, `${data.guild.coins.toLocaleString("en")} coins\n(Max ${data.guild.coinsEver.toLocaleString("en")})`)
                        .addField(`Description:`, `${data.guild.description}`)
                        .addField(`Publicly listed / Joinable:`, `${publiclyListed} / ${joinable}`)
                        .addField(`Preferred games:`, `${games}`)
                        .addField(`Top 10 most played games:`, `${mostPlayedStr}`)

                        
                    interaction.reply({embeds: [embed]})
                })
            }).on('error', (err) => {console.error(err); return interaction.reply({content: `**There was an error while executing this command!**\n*{${err}}*`, ephemeral: true})})
        }
    },
};