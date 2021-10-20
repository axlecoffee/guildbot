const Discord = require('discord.js')
const fs = require('fs')
const {MessageButton,MessageActionRow} = require('discord.js');

module.exports.run = async (client, button, config) => {
    let buttonFoward = new MessageButton()
        .setStyle(2)
        .setEmoji('▶️')
        .setLabel('')
        .setCustomId('help_menu_2')
    let buttonBackwards = new MessageButton()
        .setStyle(2)
        .setEmoji('◀️')
        .setLabel('')
        .setCustomId('help_menu_0')
    let row = new MessageActionRow()
        .addComponents(buttonBackwards, buttonFoward)
    const embed = new Discord.MessageEmbed()
        .setColor(config.embedcolour.b)
        .setTimestamp()
        .setFooter('Developed by @MCUniversity#0859')
        .setTitle("Commands:")
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        if (command.help) {embed.addField(`**/${command.data.name}**`, `${command.data.description}`)}
    }
    button.update({
        embeds: [embed],
        components: [row]
    });
}