//https://api.hypixel.net/player?key=${apikey}&uuid=${uuid}
//https://api.mojang.com/users/profiles/minecraft/${username}
const Discord = require('discord.js')
const https = require('https')
require('dotenv').config()
const db = require('../stormdb.js')

module.exports.run = async (client, message, args, config) => {
    if (args[0] == 'check') {
        let id;
        if (args[1]) {
            id = args[1]
        } else {
            id = message.author.id
        }

        let userData;
        if (db.get(`accountLinks`).get(`${id}`).value() == undefined) {
            userData = undefined;
        } else {
            userData = db.get(`accountLinks`).get(`${id}`).get(`name`).value()
        }

        let embed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
        if (userData == undefined) {
            embed.addField("This account is NOT linked!", `To link a minecraft account to a discord account, use the **\*link update** command.`)
        } else {
            embed.addField("This account is linked!", `**Minecraft account:** ${userData}`)
        }
        message.channel.send(embed)

        //Fetch data from DB based on message author ID

    } else if (args[0] == 'update') {
        let username = args[1]
        const uuid_req = https.get(`https://api.mojang.com/users/profiles/minecraft/${username}`, (uuid_res) => {
            let uuid_data_raw = "";
            uuid_res.on('data', data_chunk => {
                uuid_data_raw += data_chunk;
            })
            uuid_res.on('end', async () => {
                uuid_data = JSON.parse(uuid_data_raw)
                //Check if valid username then fetch data based on player UUID
                if (uuid_data.id) {
                    const req = https.get(`https://api.hypixel.net/player?key=${process.env.APIKEY}&uuid=${uuid_data.id}`, (res) => {
                        let data_raw = "";
                        res.on('data', data_chunk => {
                            data_raw += data_chunk;
                        })
                        res.on('end', async () => {
                            data = JSON.parse(data_raw)
                            if (data.success == true) {
                                let socialmediadata = undefined;
                                try {
                                    socialmediadata = data.player.socialMedia.links.DISCORD
                                } catch(err){}
                                if (socialmediadata) {
                                    let discord = data.player.socialMedia.links.DISCORD
                                    if (discord == message.author.tag) {
                                        db.set(`accountLinks.${message.author.id}`, {
                                            name: uuid_data.name,
                                            uuid: uuid_data.id
                                        }).save();
                                        let logembed = new Discord.MessageEmbed()
                                            .setColor(config.embedcolour.b)
                                            .setTimestamp()
                                            .setTitle('<:log_emoji:868054485933625346> LOG')
                                            .addField(`**Account link successful.**`, `**Discord account tag:** ${message.author.tag}\n**Discord account ID:** ${message.author.id}\n**Minecraft account name:** ${uuid_data.name}\n**Minecraft account UUID:** ${uuid_data.id}\n`)
                                        let logchannel = client.channels.cache.get(config.logchannel)
                                        logchannel.send({
                                            embed: logembed
                                        })
                                        let embed = new Discord.MessageEmbed()
                                            .setColor(config.embedcolour.a)
                                            .setTimestamp()
                                            .addField("Success.", `Successfully linked **${uuid_data.name}** to **<@${message.author.id}>**`)
                                        message.channel.send(embed)
                                    } else {
                                        let embed = new Discord.MessageEmbed()
                                            .setColor('RED')
                                            .setTimestamp()
                                            .setTitle('<:error_emoji:868054485946224680> An error has occurred.')
                                            .addField(`**This player\'s discord account does not match your discord account.**`, `**You need to set your discord account in the profile menu on Hypixel.**\nMake sure you entered your full discord tag (e.g. **Username#0001**).`)
                                        let msg = await message.channel.send(embed)
                                        msg.delete({
                                            timeout: 15000
                                        })
                                        message.delete({
                                            timeout: 15000
                                        })
                                    }
                                } else {
                                    //Throw error -> User has not set their DISCORD account in game
                                    let embed = new Discord.MessageEmbed()
                                            .setColor('RED')
                                            .setTimestamp()
                                            .setTitle('<:error_emoji:868054485946224680> An error has occurred.')
                                            .addField(`**This player\'s discord account does not match your discord account.**`, `**You need to set your discord account in the profile menu on Hypixel.**\nMake sure you entered your full discord tag (e.g. **Username#0001**).`)
                                        let msg = await message.channel.send(embed)
                                        msg.delete({
                                            timeout: 15000
                                        })
                                        message.delete({
                                            timeout: 15000
                                        })
                                }
                            } else {
                                let embed = new Discord.MessageEmbed()
                                    .setColor('RED')
                                    .setTimestamp()
                                    .setTitle('<:error_emoji:868054485946224680> An error has occurred.')
                                    .addField(`**${data.cause}**`, `*This probably means the API key is invalid. Ping <@299265668522442752>.*`)
                                let msg = await message.channel.send(embed)
                                msg.delete({
                                    timeout: 15000
                                })
                                message.delete({
                                    timeout: 15000
                                })
                                let logembed = new Discord.MessageEmbed()
                                    .setColor('RED')
                                    .setTimestamp()
                                    .setTitle('<:error_emoji:868054485946224680> ERROR')
                                    .addField(`**Cause: **`, `A player ran a bot command and the Hypixel API key provided by the config file was invalid.`)
                                let logchannel = client.channels.cache.get(config.logchannel)
                                logchannel.send("<@299265668522442752> <@299265668522442752> <@299265668522442752>", {
                                    embed: logembed
                                })
                            }

                        })
                    }).on("error", (err) => {
                        console.log("Error: " + err.message);
                    });


                } else {
                    let embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTimestamp()
                        .setTitle('<:error_emoji:868054485946224680> An error has occurred.')
                        .addField(`**${uuid_data.error}**`, `**${uuid_data.errorMessage}**\n*This probably means the username you entered does not exist.*`)
                    let msg = await message.channel.send(embed)
                    msg.delete({
                        timeout: 15000
                    })
                    message.delete({
                        timeout: 15000
                    })
                }
            })
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } else if (args[0] == 'tutorial') {
        message.channel.send({
            files: [{
                attachment: './discord_link_tutorial.gif',
                name: 'tutorial.gif'
            }]
        })
    } else {
        let embed = new Discord.MessageEmbed()
            .setColor(config.embedcolour.a)
            .setTimestamp()
            .addField("Account linking system.", "**This system is in place to make applying to join the guild easier. It links your discord account with your minecraft account.\nCommands:**\n\*link help - Open this menu\n\*link check [ID] - Check your own status, or the status of another person\n\*link update <IGN> - Create/update the minecraft account linked to your discord account.\n\*link tutorial - Shows a gif with the tutorial on how to link your discord")
            .setFooter('[Optional parameter] | <Required parameter>')
        message.channel.send(embed)
    }
}