const Discord = require('discord.js')
const config = require('../config.json')
const { MessageSelectMenu } = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (message.member.roles.cache.has('592743020609142796') || message.member.roles.cache.has('586584388704272400')) {
        message.delete()
        if (args[0] == "rr_colour") {
            const pink = {value: 'rr_pink', label: 'Pink', description: 'Get the pink role colour', emoji: '897544182959333407'}
            const purple = {value: 'rr_purple', label: 'Purple', description: 'Get the purple role colour', emoji: '897544182908985354'}
            const blue = {value: 'rr_blue', label: 'Blue', description: 'Get the blue role colour', emoji: '897544182938353684'}
            const aqua = {value: 'rr_aqua', label: 'Aqua', description: 'Get the aqua role colour', emoji: '897544183013867560'}
            const green = {value: 'rr_green', label: 'Green', description: 'Get the green role colour', emoji: '897544182875447357'}
            const yellow = {value: 'rr_yellow', label: 'Yellow', description: 'Get the yellow role colour', emoji: '897544183001264209'}
            const orange = {value: 'rr_orange', label: 'Orange', description: 'Get the orange role colour', emoji: '897544182938341446'}
            const red = {value: 'rr_red', label: 'Red', description: 'Get the red role colour', emoji: '897544182988693524'}
            const lightpink = {value: 'rr_lightpink', label: 'Light Pink', description: 'Get the light pink role colour', emoji: '897544182997086238'}
            const lightpurple = {value: 'rr_lightpurple', label: 'Light Purple', description: 'Get the light purple role colour', emoji: '897544182992871456'}
            const lightblue = {value: 'rr_lightblue', label: 'Light Blue', description: 'Get the light blue role colour', emoji: '897544182980296704'}
            const ultralightblue = {value: 'rr_ultralightblue', label: 'Ultra-Light Blue', description: 'Get the ultra light blue role colour', emoji: '897544182854467614'}
            const lightaqua = {value: 'rr_lightaqua', label: 'Light Aqua', description: 'Get the light aqua role colour', emoji: '897544182883827722'}
            const lightgreen = {value: 'rr_lightgreen', label: 'Light Green', description: 'Get the light green role colour', emoji: '897544182984499311'}
            const lightyellow = {value: 'rr_lightyellow', label: 'Light Yellow', description: 'Get the light yellow role colour', emoji: '897544182854463528'}
            const lightred = {value: 'rr_lightred', label: 'Light Red', description: 'Get the light red role colour', emoji: '897544183013855293'}

            const menu = new MessageSelectMenu()
                .setPlaceholder("Select a colour role.")
                .setCustomId("reactionroles")
                .addOptions([pink, purple, blue, aqua, green, yellow, orange, red, lightpink, lightpurple, lightblue, ultralightblue, lightaqua, lightgreen, lightyellow, lightred])
                .setMaxValues(16)
                .setMinValues(0)
            const row = new Discord.MessageActionRow()
                .addComponents(menu)
            message.channel.send({content: "​", components: [row]}) //ZERO-WIDTH SPACE
        } else if (args[0] == "rr_pings") {
            const updatePings = {value: 'rr_updates', label: 'Updates and announcements', description: 'Recieve a ping for important updates and announcements.', emoji: '📣'}
            const giveawayPings = {value: 'rr_giveaways', label: 'Giveaways', description: 'Recieve a ping for giveaways.', emoji: '🎉'}
            const lookingForParty = {value: 'rr_lfp', label: 'Looking for party', description: 'Get pinged by other players when they are looking for a party.', emoji: '797755651022913597'}
            const menu = new MessageSelectMenu()
                .setPlaceholder("Select a notification role")
                .setCustomId("pingingroles")
                .addOptions([updatePings, giveawayPings, lookingForParty])
                .setMaxValues(3)
                .setMinValues(0)
            const row = new Discord.MessageActionRow()
                .addComponents(menu)
            message.channel.send({content: "​", components: [row]}) //ZERO-WIDTH SPACE
        }
    }
}