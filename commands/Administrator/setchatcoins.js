const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setchatcoins",
    description: "Sets the amount of coins that can be given through each chat message.",
    usage: "<coin-name>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:error:946775591460421683> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre = args[0];

        if (!pre) return message.reply("<:error:946775591460421683> : Please mention an amount for the daily limit")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.chatCoins = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The chat reward has been changed to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    chatCoins: pre
                }).save()
                message.reply(`The chat reward has been changed to ${args[0]}`)
            }
        })
    }
}