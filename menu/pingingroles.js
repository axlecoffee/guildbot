const Discord = require('discord.js')

module.exports.run = async (client, menu, config) => {
    let user = await menu.clicker.member
    if (!menu.values[0]) {
        //return menu.reply.send(`No options selected. Nothing happened`, true)
        menu.reply.defer()
    } else {
        let addedCounter = 0
        let removedCounter = 0
        for (let i = 0;i<menu.values.length;i++) {
            let menuValue = menu.values[i]
            if (menuValue == 'rr_updates') {
                if (user.roles.cache.has("776011577031262208")) {
                    await user.roles.remove("776011577031262208")
                    removedCounter++;
                } else {
                    await user.roles.add("776011577031262208")
                    addedCounter++;
                }
            } else if (menuValue == 'rr_giveaways') {
                if (user.roles.cache.has("776011580495626240")) {
                    await user.roles.remove("776011580495626240")
                    removedCounter++;
                } else {
                    await user.roles.add("776011580495626240")
                    addedCounter++;
                }
            } else if (menuValue == 'rr_lfp') {
                if (user.roles.cache.has("884902238265413713")) {
                    await user.roles.remove("884902238265413713")
                    removedCounter++;
                } else {
                    await user.roles.add("884902238265413713")
                    addedCounter++;
                }
            }
        }
        menu.reply.send(`<:plus:888072519582634075> Applied - **${addedCounter}** roles\n<:minus:888072653003452516> Removed - **${removedCounter}** roles.`, true)
    }
}