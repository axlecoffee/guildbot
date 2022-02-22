const Discord = require('discord.js')
require('dotenv').config()
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.MONGO_URL)
const https = require('https')
const config = require('../config.json')
const functions = require('../functions.js')

module.exports = {
    async execute(client, interaction) {
        let message = interaction.message
        let userData;
        let userID;
        await MongoClient.connect()
        const db = MongoClient.db()
        db.collection('minecraft-accounts').findOne({discord_id: interaction.user.id}, async function (err, res) {
            if (err) throw err;
            if (res == undefined) {
                userData = undefined;
            } else {
                userData = res.minecraft_name
                userID = res.minecraft_uuid
            }
            if (userData == undefined) {
                let undefinedEmbed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTimestamp()
                    .addField(`${config.emoji.error} Minecraft account not linked!`, "Your minecraft account is not linked to your discord account. You can fix this by running the **/link update** command.")
                let linkHelpButton = new Discord.MessageButton()
                    .setStyle(1)
                    .setEmoji('ℹ️')
                    .setLabel('Learn more.')
                    .setCustomId('link_help_button')
                let row = new Discord.MessageActionRow()
                    .addComponents(linkHelpButton)
                await interaction.update({
                    embeds: [undefinedEmbed],
                    components: [row]
                });
                await MongoClient.close()
            } else {
                await MongoClient.close()
                const req = https.get(`https://api.hypixel.net/player?key=${process.env.APIKEY}&uuid=${userID}`, (res) => {
                    let data_raw = "";
                    res.on('data', data_chunk => {
                        data_raw += data_chunk;
                    })
                    res.on('end', async () => {
                        data = JSON.parse(data_raw)
                        if (data.success == true) {
                            networkLevel = Math.round((Math.sqrt((2 * parseInt(data.player.networkExp)) + 30625) / 50) - 2.5)
                            networkLevelRaw = (Math.sqrt((2 * parseInt(data.player.networkExp)) + 30625) / 50) - 2.5
                            if (networkLevel >= 50) {
                                let sucessembed = new Discord.MessageEmbed()
                                    .setColor(config.colours.main)
                                    .setTimestamp()
                                    .addField('Your application was accepted.', 'Thank you.')
                                    .addField(`${config.emoji.log} Warning:`, "Make sure to leave your current guild if you are in one, or we will not be able to send you an invitation.\nMake sure your guild invites are turned **on** in your privacy settings. You can view the settings inside the profile menu (Right click your head in slot 2 of your hotbar) from any lobby on the hypixel network.")
                                let helperPing=""
                                for (let i = 0;i<config.roles.helperRole.length;i++) {
                                    helperPing+=`<@&${config.roles.helperRole[i]}>`
                                }
                                if (helperPing!="") {
                                    message.channel.send(helperPing)
                                }
                                interaction.update({
                                    embeds: [sucessembed],
                                    components: []
                                });
    
                                const logembed = new Discord.MessageEmbed()
                                    .setColor("GREEN")
                                    .setTimestamp()
                                    .setAuthor(interaction.user.tag)
                                    .setThumbnail(interaction.user.displayAvatarURL())
                                    .addField('**Successful application**', `**Questions 1-3 (requirements):**\nUser anwsered **YES**.\n**Linked IGN:**\n*${userData}*\n**Their network level:** ${networkLevelRaw}`)
                                channel = client.channels.cache.get(config.channels.appChannelId)
                                channel.send({
                                    embeds: [logembed]
                                })
    
                                const queueembed = new Discord.MessageEmbed()
                                    .setColor(config.colours.secondary)
                                    .setTimestamp()
                                    .addField(`**${userData}**`, `\`\`/g invite ${userData}\`\``)
                                let deletebutton = new Discord.MessageButton()
                                    .setStyle(4)
                                    .setLabel('Invite sent -> Delete from queue')
                                    .setCustomId('delete_message')
                                let row = new Discord.MessageActionRow()
                                    .addComponents(deletebutton)
                                queuechannel = client.channels.cache.get(config.channels.queueChannelId)
                                queuechannel.send({
                                    embeds: [queueembed],
                                    components: [row]
                                })
                                interaction.member.roles.add(config.roles.guildMemberRole)
                                functions.statistics.increaseGuildApplicationCount()
                            } else {
                                let nembed = new Discord.MessageEmbed()
                                    .setColor(config.colours.main)
                                    .setTimestamp()
                                    .setTitle(`**We're sorry but you do not meet the requirements to join the guild.**\nRequired network level: 50\nYour network level: ${networkLevelRaw}`)
                                interaction.update({
                                    embeds: [nembed],
                                    components: []
                                });
                                const logembed = new Discord.MessageEmbed()
                                    .setColor("RED")
                                    .setTimestamp()
                                    .setAuthor(interaction.user.tag)
                                    .setThumbnail(interaction.user.displayAvatarURL())
                                    .addField('**Failed application**', `**User did not meet the network level 50 requirement.**\nTheir IGN: ${userData}\nTheir NW level: ${networkLevelRaw}`)
                                channel = client.channels.cache.get(config.channels.appChannelId)
                                channel.send({
                                    embeds: [logembed]
                                })
                            }
                        } else {
                            let embed = new Discord.MessageEmbed()
                                .setColor('RED')
                                .setTimestamp()
                                .setTitle(`${config.emoji.error} An error has occurred.`)
                                .addField(`**${data.cause}**`, `*This probably means the API key is invalid. Ping <@299265668522442752>.*`)
                            let msg = await message.reply({
                                embeds: [embed],
                                allowedMentions: {
                                    repliedUser: false
                                }
                            })
                            setTimeout(() => {
                                msg.delete();
                                message.delete()
                            }, 15000);
                            let logembed = new Discord.MessageEmbed()
                                .setColor('RED')
                                .setTimestamp()
                                .setTitle(`${config.emoji.error} ERROR`)
                                .addField(`**Cause: **`, `A player ran a bot command and the Hypixel API key provided by the config file was invalid.`)
                            let logchannel = client.channels.cache.get(config.channels.logChannelId)
                            logchannel.send({
                                content: "<@299265668522442752> <@299265668522442752> <@299265668522442752>",
                                embeds: [logembed]
                            })
                        }
                    })
                }).on("error", (err) => {
                    return console.error("Error: " + err.message);
                })
            }
        })
    }
}