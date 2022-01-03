<h1 align="center">Setting the bot up</h1>

## Enviromental variables

Enviromental variables are used for saving sensitive data (e.g. your discord token).

To handle enviromental variables the project uses the [dotenv](https://www.npmjs.com/package/dotenv) npm package.

You must create a ".env" file in the root of the project and create all the necessary variables for the bot to function.

You can find more info on how to do that [here](https://www.npmjs.com/package/dotenv).

Variables that must be created in order for the bot to function:

**"TOKEN"** - contains your discord bot's token.

**"APIKEY"** - contains your hypixel API key. To get/reset your api key, use the "/api new" command anywhere on the hypixel network.

**"MONGO_URL"** - contains the URL of your MongoDB server. You must include the database name after the URL so the project knows where to save data (e.g. mongodb://localhost:27017/guildbot; mongodb://localhost:27017/ being the URL and guildbot the database name.)

## Additional confirugation - config.json file

The **config.json** file is used for saving less sesitive configuration data.

```json

{
    "guildId": "DISCORDID",
    "hypixelGuildId":"UUID",
    "embedcolour": {
        "a":"1EC45B",
        "b":"00AA00",
        "c":"0075FC"
    },
    "roles":{
        "guildMemberRole":"DISCORDID",
        "helpers":["DISCORDID", "DISCORDID"],
        "adminRole":"DISCORDID"
    },
    "channels":{
        "logChannelId":"DISCORDID",
        "appLogChannelId":"DISCORDID",
        "queueChannelId":"DISCORDID",
        "ticketCategoryId":"DISCORDID",
        "starboardChannelId":"DISCORDID",
        "memberCount": {
            "discord":"DISCORDID",
            "guild":"DISCORDID"
        }
    },
    "url":{
        "guild_staff_application":"URL",
        "forums_post":"URL"
    },
    "starboard":{
        "minimumCount": 4
    },
    "emoji":{
        "halloween":{"e": ["🍬", "🎃", "👻", "🦇"], "desc":"Halloween emoji"},
        "christmas":{"e": ["🎄", "⛄", "🎁", "🍪"], "desc":"Christmas emoji"}
    },
    "repo": {
        "maintainer":"@MCUniversity#0859",
        "supportServerInviteCode":"whGyz8ABM5",
        "repoUrl":"https://github.com/MCUniversity/guildbot",
        "repoRaw":"https://raw.githubusercontent.com/MCUniversity/guildbot/main/"
    }
}

```

**guildId** is the ID of the discord server the bot operates in.

**hypixelGuildId** is the UUID of the hypixel guild.

**embedcolour** is an object containing HEX values for various colours the bot uses. You can change these if you do not like the default ones.

**roles** is an object containing ID's of various discord roles.

- **guildMemberRole** is the role a guild member recieves when their application is accepted.

- **helpers** are the 2 roles that get pinged when an application is accepted so they can invite the member.

- **adminRole** is the role that will grant users permission to access administrator-only commands such as /emit and /summon in the bot.

**scheduledEvents** contains strings for various repeating scheduled tasks that are used by [node-schedule](https://www.npmjs.com/package/node-schedule). They are formatted like this:

```txt
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

- **leaderboardDataUpdate**
Is used by the bot to determine the interval of time that should pass between every update of the guild leaderboard data.
The default is 1 minute (**\*/1 \* \* \* \***) meaning the data will be updated every minute, exactly on the minute.
For more complex configuration check the module's [repository on npmjs.com](https://www.npmjs.com/package/node-schedule).

**channels** contains ID's for various discord channels and categories the bot interacts with:

- **logChannelId** - channel used for general logs.

- **appLogChannelId** - channel used for membership application logs. Can be the same or seperate as the default log channel.

- **queueChannelId** - channel used for the invite queue feature - when a member is to be invited, a message gets sent in this channel with their name and an easy to copy command for staff members to use. After they are invited, the message for that member can be easily deleted via a button.

- **ticketCategoryId** - category where the bot will auto-move all new created channels prefixed with "ticket-". This is used to organise "Ticket tool bot" tickets.

- **starboardChannelId** - channel used for the starboard feature.

- **memberCount** - channels that act as member counts: discord being the discord server member count and guild being the hypixel guild member count.

**url** contains various URL's the bot uses.

- **guild_staff_application** is the URL of the staff application. This is sent when a user requests a staff application.

- **forums_post** is the guild's forums post. This is linked when a ticket is created.

**starboard** contains configuration options for the starboard feature

- **minimumCount** defines the minimum amount of stars a message needs before being sent to the starboard.

**emoji** contains emoji for the /emojify command. The command allows administrators to add random emoji prefixes to all guild members. You may add your own options if you wish, using this formula (There is no coded limit to the amount of various emoji, but don't go over the top. Too many may lag the bot. Putting one will result in that single emoji being applied everywhere):

```json
"name_of_option": {"e":["emoji1", "emoji2"], "desc":"A short description of this option"}
```

## MongoDB

This project requires an installation of MongoDB to function.

You can get a community server [here](https://www.mongodb.com/try/download/community).

You could alternatively also use [MongoDB atlas](https://www.mongodb.com/atlas).

The project uses [the official MongoDB module](https://www.npmjs.com/package/mongodb) to interact with the database.

The URL to the installation of the DB must contain the name of the database for it to function (check the Enviromental variables section for more info)
