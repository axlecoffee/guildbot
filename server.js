//Slash commands + admin perms ---> https://discord.com/api/oauth2/authorize?client_id=666672279828299804&permissions=8&scope=bot%20applications.commands
//https://api.hypixel.net/player?key=${apikey}&uuid=${uuid}
//https://api.mojang.com/users/profiles/minecraft/${username}

const fs = require('fs');
const db = require("./stormdb.js")
const ms = require("parse-ms")
const https = require('https')

const Discord = require("discord.js")
const allIntents = new Discord.Intents(32767); const client = new Discord.Client({ intents: allIntents }); //Uses all intents. The bot runs in a single server so it does not matter.

const config = require('./config.json')
const wordBlackList = require('./wordBlackList.json')
require('dotenv').config()

client.on('error', async (err) => {
    const channel = await client.channels.cache.get(config.channels.logChannelId)
    const embed = new Discord.MessageEmbed()
        .setTitle('<:error_emoji:868054485946224680> A DiscordAPIError has occurred.')
        .addField('**Cause: **', `\`\`${err.message}\`\``)
    channel.send({embeds:[embed]})
})

//Send login message and setup bot activity; Register slash commands
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    if (client.user.id == "886676473019269160") {
        console.log(`Test user detected, setting presence to OFFLINE.`)
        client.user.setPresence({ status: 'invisible' })
    } else {
        guild = client.guilds.cache.find(guild => guild.id == config.guildId)
        client.user.setActivity(`over ${guild.name}`, {type: "WATCHING"})
    }
    client.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {const command = require(`./commands/${file}`); client.commands.set(command.data.name, command);}
    const deployCommands = require(`./slash_commands.js`);
    deployCommands.deploy(client, client.user.id, config.guildId)
})

//Handle commands (DM COMMANDS ARE ONLY IN DMS, NORMAL COMMANDS ARE ONLY OUTSIDE OF DMS)
client.on('messageCreate', message => {
    if (message.author.id != client.user.id && message.author.bot != true && message.guild.id == config.guildId) {
        let sendOff = false
        let desc = `User: <@${message.author.id}> (ID: ${message.author.id})\nMessage: \`\`${message.content}\`\`\nMatches: `
        for (let i = 0;i<wordBlackList.length;i++) {
            if (message.content.includes(wordBlackList[i])) {
                sendOff = true;
                desc+=`\`\`${wordBlackList[i]}\`\` `;
            }
        }
        if (sendOff == true) {
            let embed = new Discord.MessageEmbed().setColor('RED').setTimestamp().setTitle("<:warning_emoji:868054485992357948> Message deleted due to match from word blacklist.").setDescription(desc)
            message.delete()
            let logchannel = client.channels.cache.get(config.channels.logChannelId)
            return logchannel.send({embeds: [embed]})
        }
    }
})

//Handle commands, buttons and select menus

client.on('interactionCreate', async (interaction) => {
	if (interaction.isButton()) {
        button = interaction;
        try {
            let buttonFile = require(`./buttons/${button.customId}.js`);
            buttonFile.run(client, button, config)
        } catch (err) {
            return console.log(err);
        }
    } else if (interaction.isSelectMenu()) {
        menu = interaction;
        try {
            let menuFile = require(`./menu/${menu.customId}.js`);
            menuFile.run(client, menu, config)
        } catch (err) {
            return console.log(err);
        }
    } else if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

//Update the member counter channel when someone joins the server
client.on('guildMemberAdd', (member) => {
    if (member.guild.id == config.guildId) {
        let num = member.guild.memberCount;
        member.guild.channels.cache.get("698908097510375554").setName(`📊Members: ${num}📊`);
    }
});
client.on('guildMemberRemove', (member) => {
    if (member.guild.id == config.guildId) {
        let num = member.guild.memberCount;
        member.guild.channels.cache.get("698908097510375554").setName(`📊Members: ${num}📊`);
    }
});

//Send info message one second after someone creates a ticket
client.on('channelCreate', (channel) => {
    if (channel.type == 'GUILD_TEXT' && channel.name.startsWith('ticket-')) {
        setTimeout(() => {
            channel.setParent(config.channels.ticketCategoryId, { lockPermissions: false })
            let embed = new Discord.MessageEmbed()
                .setColor(config.embedcolour.a)
                .setTitle('**A staff member will be here to help you soon.**')
                .setDescription(`**Looking to join the guild?**\n[Guild forums post](${config.links.forums_post})\n*To apply, run the **/apply** command in a ticket.*\n**Applied and waiting for a response?**\nAsk a staff member to check your application. If it gets accepted, an invite will be sent to you when a staff member is online.\n**You aren\'t online?**\nAn offline invite will be sent. This means the next time you next log in, you will have 5 minutes to join the guild before the invite expires.`) //[Guild membership application](${config.links.guild_membership_application})
                .setTimestamp()
            channel.send({embeds: [embed]})
        }, 1000);
    }
})

client.login(process.env.TOKEN)