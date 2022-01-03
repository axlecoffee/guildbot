require('dotenv').config()
const logging = require('./consoleFormatting.js'); logging.log(); logging.warn(); logging.error(); logging.info(); //console.log('log'); console.warn('warn'); console.error('error'); console.info('info'); //For testing
const fs = require('fs');
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.MONGO_URL)
const functions = require('./functions.js')
const https = require('https')
const schedule = require('node-schedule');

const Discord = require("discord.js")
const allIntents = new Discord.Intents(32767); const client = new Discord.Client({ intents: allIntents }); //Uses all intents. The bot runs in a single server so it does not matter.

const config = require('./config.json')

client.on('error', async (err) => {
    const channel = await client.channels.cache.get(config.channels.logChannelId)
    const embed = new Discord.MessageEmbed()
        .setTitle('<:error_emoji:868054485946224680> A DiscordAPIError has occurred.')
        .addField('**Cause: **', `\`\`${err.message}\`\``)
    channel.send({embeds:[embed]})
})

//client.on('debug', async (debug) => {console.info(debug)}) //Uncomment for debugging.

//Send login message and setup bot activity; Register slash commands
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await MongoClient.connect();
    const db = MongoClient.db();
    db.collection('starboard').findOne({}, async function (err, res) {
        if (err) throw err;
        if (res != undefined) {
            db.collection('starboard').drop().then(() => MongoClient.close()) //Drop starboard collection if it exists, as all the data is unusable after the bot restarts.
        }
    })
    if (client.user.id == "886676473019269160") {
        console.log(`Test user detected, setting presence to OFFLINE.`)
        client.user.setPresence({ status: 'invisible' })
    } else {
        guild = await client.guilds.fetch(config.guildId)
        client.user.setActivity(`over ${guild.name}`, {type: "WATCHING"})
    }
    client.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {const command = require(`./commands/${file}`); client.commands.set(command.data.name, command);}
    const deployCommands = require(`./slashCommands.js`);
    deployCommands.deploy(client, client.user.id, config.guildId)
    functions.checkForUpdates(client)
    functions.leaderboardDataUpdate(client)
})

//Handle commands, buttons and select menus
client.on('interactionCreate', async (interaction) => {
	if (interaction.isButton()) {
        functions.statistics.increaseButtonCount()
        button = interaction;
        try {
            let buttonFile = require(`./buttons/${button.customId}.js`);
            buttonFile.run(client, button)
        } catch (err) {
            return console.log(err);
        }
    } else if (interaction.isSelectMenu()) {
        functions.statistics.increaseSelectMenuCount()
        menu = interaction;
        try {
            let menuFile = require(`./menu/${menu.customId}.js`);
            menuFile.run(client, menu)
        } catch (err) {
            return console.log(err);
        }
    } else if (interaction.isCommand()) {
        functions.statistics.increaseCommandCount()
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        let now = Date.now()
        const qfilter = {
            guildid: interaction.guild.id,
            command: interaction.commandName
        }
        if (command.cooldown) {
            await MongoClient.connect()
            const db = MongoClient.db()
            await db.collection('cooldown').findOne(qfilter, async function (err, res) {
                if (err) throw err;
                let nextAvailable;
                if (res != null) {
                    nextAvailable = res.value;
                }
                if (nextAvailable == undefined) nextAvailable = 0;
                if (nextAvailable - now > 0) {
                    await interaction.reply({
                        content: `**Command on cooldown! Please wait *${(nextAvailable-now)/1000}* more seconds.**`,
                        ephemeral: true
                    });
                } else {
                    try {
                        await command.execute(client, interaction);
                        const db = MongoClient.db()
                        db.collection('cooldown').findOne(qfilter, async function (err, res) {
                            if (err) throw err;
                            if (res == null) {
                                db.collection('cooldown').insertOne({
                                    guildid: interaction.guild.id,
                                    command: interaction.commandName,
                                    value: now + command.cooldown
                                }, function (err, res) {
                                    if (err) throw err;
                                    MongoClient.close()
                                    return;
                                })
                            } else {
                                await db.collection('cooldown').updateOne(qfilter, {
                                    $set: {
                                        value: now + command.cooldown
                                    }
                                })
                                MongoClient.close()
                                return;
                            }
                        })        
                    } catch (error) {
                        console.error(error);
                        return interaction.reply({
                            content: '**There was an error while executing this command!**\n*No more info is available.*',
                            ephemeral: true
                        });
                    }
                }
            })
        } else {
            try {
                await command.execute(client, interaction);
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: '**There was an error while executing this command!**\n*No more info is available.*',
                    ephemeral: true
                });
            }
        }
    }
});

//Update the member counter channel when someone joins the server
client.on('guildMemberAdd', async (member) => {
    if (member.guild.id == config.guildId) {
        let num = member.guild.memberCount;
        member.guild.channels.cache.get(config.channels.memberCount.discord).setName(`📊Members: ${num}📊`);
    }
});
client.on('guildMemberRemove', async (member) => {
    if (member.guild.id == config.guildId) {
        let num = member.guild.memberCount;
        member.guild.channels.cache.get(config.channels.memberCount.discord).setName(`📊Members: ${num}📊`);
    }
});

//Send info message one second after someone creates a ticket
client.on('channelCreate', async (channel) => {
    if (channel.type == 'GUILD_TEXT' && channel.name.startsWith('ticket-')) {
        setTimeout(() => {
            channel.setParent(config.channels.ticketCategoryId, { lockPermissions: false })
            let embed = new Discord.MessageEmbed()
                .setColor(config.embedcolour.a)
                .setTitle('**A staff member will be here to help you soon.**')
                .setDescription(`**Looking to join the guild?**\n[Guild forums post](${config.url.forums_post})\n*To apply, run the **/apply** command in a ticket.*\n**Applied and waiting for a response?**\nAsk a staff member to check your application. If it gets accepted, an invite will be sent to you when a staff member is online.\n**You aren\'t online?**\nAn offline invite will be sent. This means the next time you next log in, you will have 5 minutes to join the guild before the invite expires.`)
                .setTimestamp()
            let linkingEmbed = new Discord.MessageEmbed()
                .setColor(config.embedcolour.a)
                .setTitle('**Before applying, please link your account!**')
                .setDescription('If you are here to apply for guild membership:\nBefore you may apply, you must link your minecraft account to your discord account. Press the button to learn more.')
                .setTimestamp()
            let linkHelpButton = new Discord.MessageButton()
                .setStyle(1)
                .setEmoji('ℹ️')
                .setLabel('Learn more.')
                .setCustomId('link_help_button')
            let row = new Discord.MessageActionRow()
                .addComponents(linkHelpButton)
            channel.send({embeds: [embed, linkingEmbed], components:[row]})
        }, 1000);
    }
})

client.on('messageReactionAdd', async (messageReaction, user) => {
    message = messageReaction.message;
    if (messageReaction.emoji.name == "⭐" && message.guild.id == config.guildId && message.author.id != client.user.id && messageReaction.count >= config.starboard.minimumCount) {
        message.react(`<:GoldStar:905915895937892403>`)
        let embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag.toString(), message.author.displayAvatarURL())
            .setFooter(`${messageReaction.count}⭐`)
            .setTimestamp()
        desc = `**[Jump to message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})**\n`
        if (message.content) {desc+=message.content}
        embed.setDescription(desc)
        if (message.attachments) {
            let attachment = await message.attachments.find(att => att.contentType.startsWith("image/"))
            if (attachment) {
                embed.setImage(attachment.url)
            }
        }
        await MongoClient.connect()
        const db = MongoClient.db()
        let qfilter = {messageid: message.id}
        db.collection('starboard').findOne(qfilter, async function (err, res) {
            if (res == undefined) {
                let starboard = await client.channels.fetch(config.channels.starboardChannelId)
                starboard.send({embeds: [embed]}).then(async (msg) => {
                    db.collection('starboard').insertOne({messageid: message.id, starboardid: msg.id}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                })
            } else {
                let starboard = await client.channels.fetch(config.channels.starboardChannelId)
                try {
                    starboard.messages.fetch(res.starboardid).then(async (message) => {
                        message.edit({embeds: [embed]})
                    })
                } catch (err) {
                    console.error(err)
                }
                MongoClient.close()
            }
        })
    }
})

client.on('messageReactionRemove', async (messageReaction, user) => {
    message = messageReaction.message;
    if (messageReaction.emoji.name == "⭐" && message.guild.id == config.guildId && message.author.id != client.user.id && messageReaction.count >= config.starboard.minimumCount) {
        let embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag.toString(), message.author.displayAvatarURL())
            .setFooter(`${messageReaction.count}⭐`)
            .setTimestamp()
        desc = `**[Jump to message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})**\n`
        if (message.content) {desc+=message.content}
        embed.setDescription(desc)
        if (message.attachments) {
            let attachment = await message.attachments.find(att => att.contentType.startsWith("image/"))
            if (attachment) {
                embed.setImage(attachment.url)
            }
        }
        await MongoClient.connect()
        const db = MongoClient.db()
        let qfilter = {messageid: message.id}
        db.collection('starboard').findOne(qfilter, async function (err, res) {
            if (err) throw err;
            if (res == undefined) {
                let starboard = await client.channels.fetch(config.channels.starboardChannelId)
                starboard.send({embeds: [embed]}).then(async (msg) => {
                    db.collection('starboard').insertOne({messageid: message.id, starboardid: msg.id}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                })
            } else {
                let starboard = await client.channels.fetch(config.channels.starboardChannelId)
                try {
                    starboard.messages.fetch(res.starboardid).then(async (message) => {
                        message.edit({embeds: [embed]})
                    })
                } catch (err) {
                    console.error(err)
                }
                MongoClient.close()
            }
        })
    }
})


client.login(process.env.TOKEN)

const leaderboardDataUpdateJob = schedule.scheduleJob('*/1 * * * *', function(){functions.leaderboardDataUpdate(client)});