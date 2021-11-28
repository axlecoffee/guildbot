const https = require('https')
const db = require('./stormdb.js')
const config = require('./config.json')
const os = require('os')
const fs = require('fs')
const Discord = require('discord.js')
const {colours} = require('./consoleFormatting.js')

module.exports = {
    async checkForUpdates(client){
        let baseUrl = config.repo.repoRaw
        https.get(baseUrl+"package.json", (res) => {
            let data = "";
            res.on('data', data_chunk => {
                data += data_chunk;
            })
            res.on('end', async () => {
                let packageData = JSON.parse(data)
                https.get(baseUrl+"config.json", (res) => {
                    let data = "";
                    res.on('data', data_chunk => {
                        data += data_chunk;
                    })
                    res.on('end', async () => {
                        let configData = JSON.parse(data)
                        let channel = client.channels.cache.get(config.channels.logChannelId)
                        if (configData.version != packageData.version) {
                            let embed = new Discord.MessageEmbed()
                                .setColor('RED')
                                .setTimestamp()
                                .addField('<:error_emoji:868054485946224680> An error occured!', `An error has occured whilst attempting to check for GuildBot updates. A new version was pushed to the repository, but values in configuration files were not updated correctly. Please notify ${config.repo.maintainer} about this or post an issue on the github repository: ${config.repo.repoUrl}.`)
                            channel.send({embeds: [embed]})
                            console.error(`${colours.reset}${colours.fg.red}An error has occured whilst attempting to check for GuildBot updates. A new version was pushed to the repository, but values in configuration files were not updated correctly. Please notify ${config.repo.maintainer} about this or post an issue on the github repository: ${config.repo.repoUrl}.${colours.reset}`)
                        } else {
                            if (config.version > configData.version) {
                                let embed = new Discord.MessageEmbed()
                                    .setColor('YELLOW')
                                    .setTimestamp()
                                    .addField('<:warning_emoji:868054485992357948> Warning!', `You are running either an unreleased or a misconfigured version of GuildBot. \nOnly proceed if you are sure you know what you're doing. \nIf not, contact ${config.repo.maintainer} about this or post an issue on the github repository: ${config.repo.repoUrl}.`)
                                channel.send({embeds: [embed]})
                                console.warn(`${colours.reset}${colours.fg.yellow}You are running either an unreleased or a misconfigured version of GuildBot. Only proceed if you are sure you know what you're doing. If not, contact ${config.repo.maintainer} about this or post an issue on the github repository: ${config.repo.repoUrl}.${colours.reset}`)
                            } else if (config.version < configData.version) {
                                let embed = new Discord.MessageEmbed()
                                    .setColor('YELLOW')
                                    .setTimestamp()
                                    .addField('<:warning_emoji:868054485992357948> Warning!', `A new version of GuildBot is available!\n**${config.version} => ${configData.version}**\nDownload it now at ${config.repo.repoUrl}`)
                                channel.send({embeds: [embed]})
                                console.info(`${colours.reset}${colours.fg.yellow}A new version of GuildBot is available!\n${colours.bright}${config.version} => ${configData.version}\n${colours.reset}${colours.fg.yellow}Download it now at ${config.repo.repoUrl}${colours.reset}`)
                            } else if (config.version == configData.version) {
                                console.log(`${colours.fg.white}No updates available. You are running the latest version of GuildBot: ${colours.bright}${config.version}${colours.reset}`)
                            }
                        }
                    })
                })
            })
        })
    },
    async leaderboardDataUpdate(){
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
                    for (const member of hGuild.guild.members) {
                        https.get(`https://minecraft-api.com/api/pseudo/${member.uuid}/json`, (memberdata) => {
                            let nameData = "";
                            memberdata.on('data', data_chunk => {
                                nameData += data_chunk;
                            })
                            memberdata.on('end', () => {
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
                                if (member.rank == "GUILDMASTER") {
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
                            })
                        }).on("error", (err) => {
                            return console.error(err);
                        })
                    }
                    setTimeout(() => {
                        db.set(`guildApiData.leaderBoardData`, leaderboardData).save()
                        db.set(`guildApiData.leaderBoardDataTimeStamp`, Date.now()).save()
                    }, 5000)
                } else {
                    console.error(hGuild)
                }
            })
        }).on("error", (err) => {
            return console.error(err);
        })
    },
    async blacklistUpdate(){
        let url = config.url.scamLinkBlacklist
        https.get(url, (res) => {
            let data = "";
            res.on('data', data_chunk => {
                data += data_chunk;
            })
            res.on('end', async () => {
                let newBlacklist = data.split("\n").filter(e=>e)
                fs.writeFile('wordBlackList.json', JSON.stringify(newBlacklist), (err) => {
                    if (err) return console.error(err)
                })
            })
        })
    },
    statistics: {
        async increaseButtonCount() {
            let count = db.get(`stat`).get(`countButtons`).value()
            db.set(`stat.countButtons`, count+1).save()
        },
        async increaseCommandCount() {
            let count = db.get(`stat`).get(`countCommands`).value()
            db.set(`stat.countCommands`, count+1).save()
        },
        async increaseSelectMenuCount() {
            let count = db.get(`stat`).get(`countSelectMenu`).value()
            db.set(`stat.countSelectMenu`, count+1).save()
        },
        async increaseGuildApplicationCount() {
            let count = db.get(`stat`).get(`countGuildApplications`).value()
            db.set(`stat.countGuildApplications`, count+1).save()
        }
    }
}