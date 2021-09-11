//Slash commands + admin perms ---> https://discord.com/api/oauth2/authorize?client_id=666672279828299804&permissions=8&scope=bot%20applications.commands
//https://api.hypixel.net/player?key=${apikey}&uuid=${uuid}
//https://api.mojang.com/users/profiles/minecraft/${username}

const Discord = require("discord.js")
const client = new Discord.Client()
require('discord-buttons')(client);
const db = require("./stormdb.js")
const ms = require("parse-ms")
const https = require('https')
const config = require('./config.json')
require('dotenv').config()

//Handle commands (DM COMMANDS ARE ONLY IN DMS, NORMAL COMMANDS ARE ONLY OUTSIDE OF DMS)
client.on('message', message => {
    if (message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase();
    if (message.content.indexOf(config.prefix) !== 0) return;
    if (message.guild != null) {
        try {
            let commandFile = require(`./commands/${command}.js`);
            commandFile.run(client, message, args, config)
        } catch (err) {
            return console.log(err);
        }
    } else {
        try {
            let commandFile = require(`./dm-commands/${command}.js`);
            commandFile.run(client, message, args, config)
        } catch (err) {
            console.log(err)
        }
    }
})

//Handle buttons
client.on('clickButton', async (button) => {
    try {
        let buttonFile = require(`./buttons/${button.id}.js`);
        buttonFile.run(client, button, config)
    } catch (err) {
        return console.log(err);
    }
})

//Send login message and setup bot activity.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    guild = client.guilds.cache.find(guild => guild.id == config.guildid)
    beforename = guild.name
    client.user.setActivity(`over ${guild.name}`, {
        type: "WATCHING"
    }).then().catch(console.error);
    setInterval(function () {
        g = client.guilds.cache.find(guild => guild.id == config.guildid)
        if (g.name != beforename) {
            beforename = g.name
            client.user.setActivity(`over ${guild.name}`, {type: "WATCHING"}).then().catch(console.error);
        }
    }, 60000);
})

//Update the member counter channel when someone joins the server
client.on('guildMemberAdd', (member) => {
    if (member.guild.id == config.guildid) {
        let num = member.guild.memberCount;
        member.guild.channels.cache.get("698908097510375554").setName(`📊Members: ${num}📊`);
    }
});
client.on('guildMemberRemove', (member) => {
    if (member.guild.id == config.guildid) {
        let num = member.guild.memberCount;
        member.guild.channels.cache.get("698908097510375554").setName(`📊Members: ${num}📊`);
    }
});
client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember.premiumSinceTimestamp != newMember.premiumSinceTimestamp) {
        newMember.guild.channels.cache.get("790097616973201459").send(`Thank you, ${newMember.user}, for boosting ${newMember.guild.name}!`)
        newMember.send(`Thank you for boosting ${newMember.guild.name}. You will recieve your booster role and its perks shortly.`)
    }
})
//Send info message one second after someone creates a ticket
client.on('channelCreate', (channel) => {
    if (channel.type == 'text' && channel.name.startsWith('ticket-')) {
        setTimeout(() => {
            let embed = new Discord.MessageEmbed()
                .setColor(config.embedcolour.a)
                .setTitle('**A staff member will be here to help you soon.**')
                .setDescription(`**Looking to join the guild?**\n[Guild forums post](${config.links.forums_post})\nTo apply, run the **\*apply** command in a ticket.\n**Applied and waiting for a response?**\nAsk a staff member to check your application. If it gets accepted, an invite will be sent to you when a staff member is online.\n**You aren\'t online?**\nAn offline invite will be sent. This means the next time you next log in, you will have 5 minutes to join the guild before the invite expires.`) //[Guild membership application](${config.links.guild_membership_application})
                .setTimestamp()
            channel.send(embed)
        }, 1000);
    }
})

client.login(process.env.TOKEN)