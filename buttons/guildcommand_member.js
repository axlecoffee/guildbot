const Discord = require('discord.js')
const https = require('https')
const config = require('../config.json')

module.exports.run = async (client, button) => {
    let message = button.message
    let passedData = JSON.parse((message.content).replace("||", "").replace("||", ""))
    https.get(`https://api.hypixel.net/guild?key=${process.env.APIKEY}&id=${config.hypixelGuildId}`, (res) => {
        let data = "";
        let hGuild;
        res.on('data', data_chunk => {
            data += data_chunk;
        })
        res.on('end', () => {
            hGuild; 
            try{hGuild = JSON.parse(data)}catch(err){console.error(err)}
            if (hGuild.success) {
                hGuild.guild.members.forEach(member => {
                    if (member.uuid != passedData.uuid) return;
                    https.get(`https://minecraft-api.com/api/pseudo/${member.uuid}/json`, (memberData) => {
                        let nameData = "";
                        memberData.on('data', data_chunk => {
                            nameData += data_chunk;
                        })
                        memberData.on('end', () => {
                            mun = JSON.parse(nameData)
                            dates = Object.keys(member.expHistory)
                            let dateField = ``
                            dates.forEach((date) => {
                                dateField += `**${date} - **${member.expHistory[date].toLocaleString("en")} exp\n`
                            })
                            https.get(`https://api.hypixel.net/player?key=${process.env.APIKEY}&uuid=${passedData.uuid}`, (res) => {
                                let strData = "";
                                res.on('data', data_chunk => {
                                    strData += data_chunk;
                                })
                                res.on('end', () => {
                                    let data = JSON.parse(strData)
                                    let rank = "";
                                    if (data.player.monthlyPackageRank == "SUPERSTAR") {rank="MVP++"} else if (data.player.newPackageRank == "MVP_PLUS") {rank="MVP+"} else if (data.player.newPackageRank == "MVP") {rank="MVP"} else if (data.player.newPackageRank == "VIP_PLUS") {rank="VIP+"} else if (data.player.newPackageRank == "VIP") {rank="VIP"} else if (data.player.newPackageRank == "MVP") {rank="MVP"}
                                    let embed = new Discord.MessageEmbed()
                                        .setColor(config.embedcolour.a)
                                        .setTimestamp()
                                        .setTitle(`**${rank}** ${mun.pseudo} - Guild member data`)
                                        .setFooter(`uuid: ${passedData.uuid}`)
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
                                    button.update({
                                        content: message.content,
                                        embeds: [embed],
                                        components: [row]
                                    })
                                })
                            }).on('error', (err) => {console.error(err); return button.reply({content: `**There was an error while executing this action!**\n*{${err}}*`, ephemeral: true})})


                        })

                    }).on('error', (err) => {console.error(err); return button.reply({content: `**There was an error while executing this action!**\n*{${err}}*`, ephemeral: true})})
                })
            }

        })
    }).on('error', (err) => {console.error(err); return button.reply({content: `**There was an error while executing this action!**\n*{${err}}*`, ephemeral: true})})
}