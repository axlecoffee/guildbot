const Discord = require('discord.js')
const config = require('../config.json')
const {
    MessageActionRow,
    MessageMenu,
    MessageMenuOption,
    MessageButton,
    ButtonCollector
} = require('discord-buttons');

module.exports.run = async (client, message, args) => {
    if (message.member.roles.cache.has('592743020609142796') || message.member.roles.cache.has('586584388704272400')) {
        message.delete()
        if (args[0] == "rr_colour") {
            const pink = new MessageMenuOption().setValue('rr_pink').setLabel('Pink').setDescription('Get the pink role colour').setEmoji('886575448144871444')
            const purple = new MessageMenuOption().setValue('rr_purple').setLabel('Purple').setDescription('Get the purple role colour').setEmoji('886575638507556936')
            const blue = new MessageMenuOption().setValue('rr_blue').setLabel('Blue').setDescription('Get the blue role colour').setEmoji('886574953862950942')
            const aqua = new MessageMenuOption().setValue('rr_aqua').setLabel('Aqua').setDescription('Get the aqua role colour').setEmoji('886574071255560232')
            const green = new MessageMenuOption().setValue('rr_green').setLabel('Green').setDescription('Get the green role colour').setEmoji('886576216201633864')
            const yellow = new MessageMenuOption().setValue('rr_yellow').setLabel('Yellow').setDescription('Get the yellow role colour').setEmoji('886576332421599283')
            const orange = new MessageMenuOption().setValue('rr_orange').setLabel('Orange').setDescription('Get the orange role colour').setEmoji('886576525728694292')
            const red = new MessageMenuOption().setValue('rr_red').setLabel('Red').setDescription('Get the red role colour').setEmoji('886576639201402890')

            const lightpink = new MessageMenuOption().setValue('rr_lightpink').setLabel('Light Pink').setDescription('Get the light pink role colour').setEmoji('886577744622784532')
            const lightpurple = new MessageMenuOption().setValue('rr_lightpurple').setLabel('Light Purple').setDescription('Get the light purple role colour').setEmoji('886577875678003200')
            const lightblue = new MessageMenuOption().setValue('rr_lightblue').setLabel('Light Blue').setDescription('Get the light blue role colour').setEmoji('886573730044731432')
            const ultralightblue = new MessageMenuOption().setValue('rr_ultralightblue').setLabel('Ultra-Light Blue').setDescription('Get the ultra light blue role colour').setEmoji('886578481964679208')
            const lightaqua = new MessageMenuOption().setValue('rr_lightaqua').setLabel('Light Aqua').setDescription('Get the light aqua role colour').setEmoji('886578575682179082')
            const lightgreen = new MessageMenuOption().setValue('rr_lightgreen').setLabel('Light Green').setDescription('Get the light green role colour').setEmoji('886578707651776533')
            const lightyellow = new MessageMenuOption().setValue('rr_lightyellow').setLabel('Light Yellow').setDescription('Get the light yellow role colour').setEmoji('886578796998828053')
            const lightred = new MessageMenuOption().setValue('rr_lightred').setLabel('Light Red').setDescription('Get the light red role colour').setEmoji('886578986895958086')
            const menu = new MessageMenu()
                .setPlaceholder("Select a colour role.")
                .setID("reactionroles")
                .addOptions([pink, purple, blue, aqua, green, yellow, orange, red, lightpink, lightpurple, lightblue, ultralightblue, lightaqua, lightgreen, lightyellow, lightred])
                .setMaxValues(16)
                .setMinValues(0)
            message.channel.send("​", menu) //ZERO-WIDTH SPACE
        } else if (args[0] == "rr_pings") {
            const updatePings = new MessageMenuOption().setValue('rr_updates').setLabel('Updates and announcements').setDescription('Recieve a ping for important updates and announcements.').setEmoji('📣')
            const giveawayPings = new MessageMenuOption().setValue('rr_giveaways').setLabel('Giveaways').setDescription('Recieve a ping for giveaways.').setEmoji('🎉')
            const lookingForParty = new MessageMenuOption().setValue('rr_lfp').setLabel('Looking for party').setDescription('Get pinged by other players when they are looking for a party.').setEmoji('797755651022913597')
            const menu = new MessageMenu()
                .setPlaceholder("Select a notification role")
                .setID("pingingroles")
                .addOptions([updatePings, giveawayPings, lookingForParty])
                .setMaxValues(3)
            message.channel.send("​", menu) //ZERO-WIDTH SPACE
        }
    }
}