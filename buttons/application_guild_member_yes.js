const Discord = require('discord.js')
const {
    MessageButton,
    MessageActionRow
} = require('discord.js');
const db = require("../stormdb.js")
const https = require('https')
require('dotenv').config()
const config = require('../config.json')

module.exports.run = async (client, button) => {
    let message = button.message
    let userData;
    let userID;
    if (db.get(`accountLinks`).get(`${button.user.id}`).value() == undefined) {
        userData = undefined;
    } else {
        userData = db.get(`accountLinks`).get(`${button.user.id}`).get(`name`).value()
        userID = db.get(`accountLinks`).get(`${button.user.id}`).get(`uuid`).value()
    }

    if (userData == undefined) {
        let undefinedEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTimestamp()
            .addField("<:error_emoji:868054485946224680> Minecraft account not linked!", "Your minecraft account is not linked to your discord account. You can fix this by running the **/link update** command.")
        let linkHelpButton = new MessageButton()
            .setStyle(1)
            .setEmoji('ℹ️')
            .setLabel('Learn more.')
            .setCustomId('link_help_button')
        let row = new MessageActionRow()
            .addComponents(linkHelpButton)
        button.update({
            embeds: [undefinedEmbed],
            components: [row]
        });
    } else {
        const req = https.get(`https://api.hypixel.net/player?key=${process.env.APIKEY}&uuid=${userID}`, (res) => {
            let data_raw = "";
            res.on('data', data_chunk => {
                data_raw += data_chunk;
            })
            res.on('end', async () => {
                data = JSON.parse(data_raw)
                //Asked TCB, they said using Math.round() insted of Math.floor() on the NW level calculation was fine 
                if (data.success == true) {
                    networkLevel = Math.round((Math.sqrt((2 * parseInt(data.player.networkExp)) + 30625) / 50) - 2.5)
                    networkLevelRaw = (Math.sqrt((2 * parseInt(data.player.networkExp)) + 30625) / 50) - 2.5
                    if (networkLevel >= 50) {
                        let sucessembed = new Discord.MessageEmbed()
                            .setColor(config.embedcolour.a)
                            .setTimestamp()
                            .addField('Your application was accepted.', 'Thank you.')
                            .addField("<:log_emoji:868054485933625346> Warning:", "Make sure to leave your current guild if you are in one, or we will not be able to send you an invitation.\nMake sure your guild invites are turned **on** in your privacy settings. You can view the settings inside the profile menu (Right click your head in slot 2 of your hotbar) from any lobby on the hypixel network.")
                        message.channel.send(`<@&${config.roles.helpers[0]}> <@&${config.roles.helpers[1]}>`)
                        button.update({
                            embeds: [sucessembed],
                            components: []
                        });

                        const logembed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTimestamp()
                            .setAuthor(button.user.tag)
                            .setThumbnail(button.user.displayAvatarURL())
                            .addField('**Successful application**', `**Questions 1-3 (requirements):**\nUser anwsered **YES**.\n**Linked IGN:**\n*${userData}*\n**Their network level:** ${networkLevelRaw}`)
                        channel = client.channels.cache.get(config.channels.appLogChannelId)
                        channel.send({embeds: [logembed]})

                        const queueembed = new Discord.MessageEmbed()
                            .setColor(config.embedcolour.c)
                            .setTimestamp()
                            .addField(`**${userData}**`, `\`\`/g invite ${userData}\`\``)
                        let deletebutton = new MessageButton()
                            .setStyle(4)
                            //.setEmoji('885607339854528593')
                            .setLabel('Invite sent -> Delete from queue')
                            .setCustomId('delete_message')
                        let row = new MessageActionRow()
                            .addComponents(deletebutton)
                        queuechannel = client.channels.cache.get(config.channels.queueChannelId)
                        queuechannel.send({
                            embeds: [queueembed],
                            components: [row]
                        })
                        button.member.roles.add(config.roles.guildMemberRole)
                    } else {
                        let nembed = new Discord.MessageEmbed()
                            .setColor(config.embedcolour.a)
                            .setTimestamp()
                            .setTitle(`**We're sorry but you do not meet the requirements to join the guild.**\nRequired network level: 50\nYour network level: ${networkLevelRaw}`)
                        button.update({
                            embeds: [nembed],
                            components: []
                        });
                        const logembed = new Discord.MessageEmbed()
                            .setColor("RED")
                            .setTimestamp()
                            .setAuthor(button.user.tag)
                            .setThumbnail(button.user.displayAvatarURL())
                            .addField('**Failed application**', `**User did not meet the network level 50 requirement.**\nTheir IGN: ${userData}\nTheir NW level: ${networkLevelRaw}`)
                        channel = client.channels.cache.get(config.channels.appLogChannelId)
                        channel.send({embeds: [logembed]})
                    }
                } else {
                    let embed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTimestamp()
                        .setTitle('<:error_emoji:868054485946224680> An error has occurred.')
                        .addField(`**${data.cause}**`, `*This probably means the API key is invalid. Ping <@299265668522442752>.*`)
                    let msg = await message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
                    setTimeout(() => {msg.delete(); message.delete()}, 15000);
                    let logembed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTimestamp()
                        .setTitle('<:error_emoji:868054485946224680> ERROR')
                        .addField(`**Cause: **`, `A player ran a bot command and the Hypixel API key provided by the config file was invalid.`)
                    let logchannel = client.channels.cache.get(config.channels.logChannelId)
                    logchannel.send({
                        content: "<@299265668522442752> <@299265668522442752> <@299265668522442752>",
                        embeds: [logembed]
                    })
                }
            })
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
}