const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    help: false,
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription(`Change nickname prefix of all server members to an emoji.`)
        .addStringOption(option => {
            option
                .setName("emoji")
                .setDescription("Select an emoji theme or remove the emoji prefix")
                .setRequired(true)
                .addChoice('Clear emoji', 'clear')
            for (const key in config.emojify) {
                option.addChoice(config.emojify[key].desc, key);
            }
            return option;
        }),
    async execute(client, interaction) {
        function getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        let guild = await client.guilds.fetch(config.discordGuildId)
        if (interaction.options.getString('emoji') == "clear") {
            interaction.reply({
                content: "Clearing emoji prefixes from all guild members. \nWarning. This action may take a long time to complete and depends on the amount of guild members and the server the bot is hosted on - In testing, the bot took 5 minutes to change nicknames for 270 guild members."
            })
            for (const key in config.emojify) {
                let emoji = config.emojify[key].e
                guild.members.fetch().then(async (members) => {
                    members.forEach(async (member) => {
                        let name = member.displayName.toString()
                        for (let i = 0;i<emoji.length;i++) {
                            name = name.replace(emoji[i], "")
                        }
                        if (name != member.displayName.toString()) {
                            member.setNickname(name, `Emojify command ran by ${interaction.user.tag}.`).then(async (returnedMember) => {
                                console.log(`Applied ${name} to ${returnedMember.user.tag}.`)
                            }).catch(err => {
                                interaction.channel.send(`Manual correction required for ${member.user.toString()}.\n${err}`);
                                console.error(err)
                            })
                        }
                    })
                })
            }
        } else {
            let selected = interaction.options.getString('emoji')
            let emoji = config.emojify[selected].e
            guild.members.fetch().then(async (members) => {
                members.forEach(async (member) => {
                    let idx = getRandom(0,emoji.length-1)
                    let preName = member.displayName.toString()
                    let name = emoji[idx] + preName
                    member.setNickname(name, `Emojify command ran by ${interaction.user.tag}. Emoji list: config.emojify.halloween`).then(async (returnedMember) => {
                        console.log(`Applied ${name} to ${returnedMember.user.tag}.`)
                    }).catch(err => {
                        interaction.channel.send(`Manual correction required for ${member.user.toString()}.\n${err}`);
                        console.error(err)
                    })
                })
            })
            
            interaction.reply({
                content: `Adding emoji prefix from list \`\`config.emojify.${selected}\`\` to all guild members. \nWarning. This action may take a long time to complete and depends on the amount of guild members and the server the bot is hosted on - In testing, the bot took 5 minutes to change nicknames for 270 guild members.`
            })
        }
    },
};