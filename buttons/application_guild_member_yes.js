const Discord = require('discord.js')
const {
    MessageButton,
    MessageActionRow
} = require('discord-buttons');
const db = require("../stormdb.js")
const https = require('https')
require('dotenv').config()

module.exports.run = async (client, button, config) => {
    button.defer()
    let message = button.message
    let userData;
    let userID;
    if (db.get(`accountLinks`).get(`${button.clicker.user.id}`).value() == undefined) {
        userData = undefined;
    } else {
        userData = db.get(`accountLinks`).get(`${button.clicker.user.id}`).get(`name`).value()
        userID = db.get(`accountLinks`).get(`${button.clicker.user.id}`).get(`uuid`).value()
    }

    if (userData == undefined) {
        let undefinedEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTimestamp()
            .addField("<:error_emoji:868054485946224680> Minecraft account not linked!", "Your minecraft account is not linked to your discord account. You can fix this by running the **\*link update <IGN>** command.")
        let linkHelpButton = new MessageButton()
            .setStyle(1)
            .setEmoji('ℹ️')
            .setLabel('Learn more.')
            .setID('link_help_button')
        message.edit({
            embed: undefinedEmbed,
            component: linkHelpButton
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
                    if (networkLevel >= 35) {
                        let sucessembed = new Discord.MessageEmbed()
                            .setColor(config.embedcolour.a)
                            .setTimestamp()
                            .addField('Your application was submitted.', 'Thank you.')
                        message.edit({
                            embed: sucessembed,
                            component: null
                        });
                        let infoembed = new Discord.MessageEmbed()
                            .setColor(config.embedcolour.a)
                            .setTimestamp()
                            .setTitle("<:log_emoji:868054485933625346> Warning:")
                            .setDescription("Make sure to leave your current guild if you are in one, or we will not be able to send you an invitation.\nMake sure your guild invites are turned **on** in your privacy settings. You can view the settings inside the profile menu (Right click your head in slot 2 of your hotbar) from any lobby on the hypixel network.")
                        message.channel.send(infoembed)
                        const logembed = new Discord.MessageEmbed()
                            .setColor("GREEN")
                            .setTimestamp()
                            .setAuthor(button.clicker.user.tag)
                            .setThumbnail(button.clicker.user.displayAvatarURL())
                            .addField('**Successful application**', `**Questions 1-3 (requirements):**\nUser anwsered **YES**.\n**Linked IGN:**\n*${userData}*\n**Their network level:** ${networkLevelRaw}`)
                        channel = client.channels.cache.get(config.applogschannel)
                        channel.send(logembed)
                    } else {
                        let nembed = new Discord.MessageEmbed()
                            .setColor(config.embedcolour.a)
                            .setTimestamp()
                            .setTitle(`**We're sorry but you do not meet the requirements to join the guild.**\nRequired network level: 35\nYour network level: ${networkLevelRaw}`)
                        message.edit({
                            embed: nembed,
                            component: null
                        });
                        const logembed = new Discord.MessageEmbed()
                            .setColor("RED")
                            .setTimestamp()
                            .setAuthor(button.clicker.user.tag)
                            .setThumbnail(button.clicker.user.displayAvatarURL())
                            .addField('**Failed application**', `**User did not meet the network level 35 requirement.**\nTheir IGN: ${userData}\nTheir NW level: ${networkLevelRaw}`)
                        channel = client.channels.cache.get(config.applogschannel)
                        channel.send(logembed)
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
    }
}