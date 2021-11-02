const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    help: false,
    permissions: [{
        id: "592743020609142796",
        type: 1,
        permission: true
    }],
    data: new SlashCommandBuilder()
        .setName('emojify')
        .setDescription(`Change nickname prefix of all server members to an emoji.`)
        .addStringOption(option => option
            .setName("emoji")
            .setDescription("Select an emoji theme or remove the emoji prefix")
            .setRequired(true)
            .addChoice('Clear emoji', 'clear')
            .addChoice('Halloween emoji', 'halloween')
        )
        .setDefaultPermission(false),
    async execute(client, interaction) {
        function getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        let guild = await client.guilds.fetch(config.guildId)
        if (interaction.options.getString('emoji') == "clear") {
            let emoji = Object.entries(config.emoji)
            guild.members.fetch().then(async (members) => {
                members.forEach(async (member) => {
                    let name = member.displayName.toString()
                    for (let i = 0;i<emoji.length;i++) {
                        for (let j = 0;j<emoji[i][1].length;j++) {
                            name = name.replace(emoji[i][1][j], "")
                        }
                    }
                    member.setNickname(name, `Emojify command ran by ${interaction.user.tag}.`).then(async (returnedMember) => {
                        console.log(`Applied ${name} to ${returnedMember.user.tag}.`)
                    }).catch(err => {
                        interaction.channel.send(`Manual correction required for ${member.user.toString()}.\n${err}`);
                        console.error(err)
                    })
                })
            })
            interaction.reply({
                content: "Clearing emoji prefixes from all guild members. \nWarning. This action may take a long time to complete and depends on the amount of guild members and the server the bot is hosted on - In testing, the bot took 5 minutes to change nicknames for 270 guild members."
            })
        } else if (interaction.options.getString('emoji') == "halloween") {
            let emoji = config.emoji.halloween
            
            guild.members.fetch().then(async (members) => {
                members.forEach(async (member) => {
                    let idx = getRandom(0,emoji.length)
                    let preName = member.displayName.toString()
                    let name = emoji[idx] + preName
                    member.setNickname(name, `Emojify command ran by ${interaction.user.tag}. Emoji list: config.emoji.halloween`).then(async (returnedMember) => {
                        console.log(`Applied ${name} to ${returnedMember.user.tag}.`)
                    }).catch(err => {
                        interaction.channel.send(`Manual correction required for ${member.user.toString()}.\n${err}`);
                        console.error(err)
                    })
                })
            })
            interaction.reply({
                content: "Adding emoji prefix from list ``config.emoji.halloween`` to all guild members. \nWarning. This action may take a long time to complete and depends on the amount of guild members and the server the bot is hosted on - In testing, the bot took 5 minutes to change nicknames for 270 guild members."
            })
        }
    },
};