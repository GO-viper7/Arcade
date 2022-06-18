const serverConfig = require("../../schemas/server-config.js")
const config = require('../../config.json')

module.exports = {
    name: "triviastop",
    description: "Stops a trivia game.",
    run: async (client, message, args) => {
        let tBucks;
    
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("You don't have the \`ADMINISTRATOR\` permission to use this command!")

        await serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            if (!data) {
                new serverConfig({
                    guildId: message.guild.id,
                    triviaOn: false,
                }).save()
                message.reply(`Trivia has been stopped in ${client.channels.cache.get(data.triviaChannel)}!`)
            } else {
                data.triviaOn = false
                await data.save().catch(err => console.log(err))
                message.reply(`Trivia has been stopped in ${client.channels.cache.get(data.triviaChannel)}!`)
            }
        }).clone()
    }
}