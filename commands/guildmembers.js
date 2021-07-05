const Discord = require('discord.js')
require('dotenv').config()

module.exports.run = async (client, disbut, message, args, config) => {
    const req = https.get(`https://api.hypixel.net/guild?key=${process.env.APIKEY}`, (res) => {
        let data = "";
        let hGuild = {}
        res.on('data', data_chunk => {
            data += data_chunk;
        })
        res.on('end', () => {
            hGuild = JSON.parse(data)

            if (hGuild.success) {
                hGuild.guild.members.forEach(member => {
                    https.get(`https://sessionserver.mojang.com/session/minecraft/profile/${member.uuid}`, (datafromname) => {
                        let data2 = "";
                        res.on('data', data_chunk => {
                            data2 += data_chunk;
                        })
                        res.on('end', () => {
                            message.channel.send(JSON.stringify({
                                name: data2.name,
                                uuid: member.uuid,
                                rank: member.rank,
                                expHistory: member.expHistory
                            }))
                        })
                    })
                })
            } else {
                console.error(hGuild.cause)
            }
        })
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

module.exports.help = async () => {
    return {}
}