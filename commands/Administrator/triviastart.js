const serverConfig = require("../../schemas/server-config.js")
const config = require('../../config.json')

module.exports = {
    name: "triviastart",
    description: "Starts a trivia game.",
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
                    triviaOn: true,
                }).save()
                message.reply(`Trivia has been started in ${client.channels.cache.get(data.triviaChannel)}! The first question will be sent in 60 seconds!`)
            } else {
                data.triviaOn = true
                await data.save().catch(err => console.log(err))
                message.reply(`Trivia has been started in ${client.channels.cache.get(data.triviaChannel)}! The first question will be sent in 60 seconds!`)
            }
        })
    }
}