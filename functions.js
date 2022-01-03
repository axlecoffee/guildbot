require('dotenv').config()
const https = require('https')
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.MONGO_URL)
const config = require('./config.json')
const pkg = require('./package.json')
const os = require('os')
const fs = require('fs')
const Discord = require('discord.js')
const { colours } = require('./consoleFormatting.js')
const { compare } = require('compare-versions')

module.exports = {
    async checkForUpdates(client) {
        let baseUrl = config.repo.repoRaw
        https.get(baseUrl + "package.json", (res) => {
            let data = "";
            res.on('data', data_chunk => {
                data += data_chunk;
            })
            res.on('end', async () => {
                let packageData = JSON.parse(data)
                let channel = client.channels.cache.get(config.channels.logChannelId)
                if (compare(pkg.version.toString(), packageData.version.toString(), ">")) {
                    let embed = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setTimestamp()
                        .addField('<:warning_emoji:868054485992357948> Warning!', `You are running either an unreleased or a misconfigured version of GuildBot. \nOnly proceed if you are sure you know what you're doing. \nIf not, contact ${config.repo.maintainer} about this or post an issue on the github repository: ${config.repo.repoUrl}.`)
                    channel.send({
                        embeds: [embed]
                    })
                    console.warn(`${colours.reset}${colours.fg.yellow}You are running either an unreleased or a misconfigured version of GuildBot. Only proceed if you are sure you know what you're doing. If not, contact ${config.repo.maintainer} about this or post an issue on the github repository: ${config.repo.repoUrl}.${colours.reset}`)
                } else if (compare(pkg.version.toString(), packageData.version.toString(), "<")) {
                    let embed = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setTimestamp()
                        .addField('<:warning_emoji:868054485992357948> Warning!', `A new version of GuildBot is available!\n**${pkg.version} => ${packageData.version}**\nDownload it now at ${config.repo.repoUrl}`)
                    channel.send({
                        embeds: [embed]
                    })
                    console.info(`${colours.reset}${colours.fg.yellow}A new version of GuildBot is available!\n${colours.bright}${pkg.version} => ${packageData.version}\n${colours.reset}${colours.fg.yellow}Download it now at ${config.repo.repoUrl}${colours.reset}`)
                } else if (compare(pkg.version.toString(), packageData.version.toString(), "=")) {
                    console.log(`${colours.fg.white}No updates available. You are running the latest version of GuildBot: ${colours.bright}${pkg.version}${colours.reset}`)
                }

            })
        })
    },
    async leaderboardDataUpdate(client) {
        https.get(`https://api.hypixel.net/guild?key=${process.env.APIKEY}&id=${config.hypixelGuildId}`, (res) => {
            let leaderboardData = {};
            let data = "";
            let hGuild = {}
            res.on('data', data_chunk => {
                data += data_chunk;
            })
            res.on('end', async () => {
                hGuild;
                try {
                    hGuild = JSON.parse(data)
                } catch (err) {
                    console.error(err)
                }
                if (hGuild.success) {
                    let count = hGuild.guild.members.length
                    let channel = await client.channels.fetch(config.channels.memberCount.guild)
                    channel.setName(`📊Guild Members: ${count}📊`)
                    for (const member of hGuild.guild.members) {
                        https.get(`https://minecraft-api.com/api/pseudo/${member.uuid}/json`, (memberdata) => {
                            let nameData = "";
                            memberdata.on('data', data_chunk => {
                                nameData += data_chunk;
                            })
                            memberdata.on('end', () => {
                                if (nameData != "Player not found !") {
                                    mun = JSON.parse(nameData)
                                    dates = Object.keys(member.expHistory)
                                    let avgExp = 0;
                                    let totalExp = 0;
                                    let c = 0;
                                    dates.forEach((date) => {
                                        avgExp += member.expHistory[date]
                                        c += 1;
                                    })
                                    totalExp = avgExp;
                                    avgExp /= c;
                                    let rank;
                                    if (member.rank == "GUILDMASTER" || member.rank == "Guild Master") {
                                        rank = {
                                            "name": "Guild Master",
                                            "default": false,
                                            "tag": null,
                                            "created": hGuild.guild.created,
                                            "priority": 101
                                        }
                                    } else {
                                        rank = hGuild.guild.ranks.find(rank => rank.name.toLowerCase() == member.rank.toLowerCase())
                                    }
                                    leaderboardData[mun.pseudo.toString()] = {
                                        avg: avgExp,
                                        total: totalExp,
                                        rankName: rank.name,
                                        rankDefault: rank.default,
                                        rankTag: rank.tag,
                                        rankCreated: rank.created,
                                        rankPriority: rank.priority
                                    }
                                } else {
                                    console.warn(`Warning! Invalid UUID encountered!\n${member.uuid}`)
                                }
                            })
                        }).on("error", (err) => {
                            return console.error(err);
                        })
                    }
                    setTimeout(async () => {
                        await MongoClient.connect()
                        const db = await MongoClient.db()
                        await db.collection('hypixel-api-data').findOne({ sid: "guild-leaderboard-data" }, async function(err, res) {
                            if (err) throw err;
                            if (res == null) {
                                await db.collection('hypixel-api-data').insertOne({sid: "guild-leaderboard-data", data: leaderboardData, timestamp: Date.now()}, function(err, res) {
                                    if (err) throw err;
                                    MongoClient.close()
                                })
                            } else {
                                await db.collection('hypixel-api-data').updateOne({ sid: "guild-leaderboard-data" }, { $set: { data: leaderboardData, timestamp: Date.now() } })
                                MongoClient.close()
                            }
                        })
                    }, 5000)
                } else {
                    console.error(hGuild)
                }
            })
        }).on("error", (err) => {
            return console.error(err);
        })
    },
    statistics: {
        async increaseButtonCount() {
            await MongoClient.connect()
            const db = await MongoClient.db()
            await db.collection('statistics').findOne({ sid: "countButtons" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    await db.collection('statistics').insertOne({sid: "countButtons", value: 1}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('statistics').updateOne({ sid: "countButtons" }, { $set: { value: res.value+1 } })
                    MongoClient.close()
                }
            })
        },
        async increaseCommandCount() {
            await MongoClient.connect()
            const db = await MongoClient.db()
            await db.collection('statistics').findOne({ sid: "countCommands" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    await db.collection('statistics').insertOne({sid: "countCommands", value: 1}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('statistics').updateOne({ sid: "countCommands" }, { $set: { value: res.value+1 } })
                    MongoClient.close()
                }
            })
        },
        async increaseSelectMenuCount() {
            await MongoClient.connect()
            const db = await MongoClient.db()
            await db.collection('statistics').findOne({ sid: "countSelectMenu" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    await db.collection('statistics').insertOne({sid: "countSelectMenu", value: 1}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('statistics').updateOne({ sid: "countSelectMenu" }, { $set: { value: res.value+1 } })
                    MongoClient.close()
                }
            })
        },
        async increaseGuildApplicationCount() {
            await MongoClient.connect()
            const db = await MongoClient.db()
            await db.collection('statistics').findOne({ sid: "countGuildApplications" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    await db.collection('statistics').insertOne({sid: "countGuildApplications", value: 1}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('statistics').updateOne({ sid: "countGuildApplications" }, { $set: { value: res.value+1 } })
                    MongoClient.close()
                }
            })
        }
    }
}