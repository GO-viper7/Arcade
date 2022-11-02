const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setdaily",
    description: "Sets the amount of coins that can be claimed daily.",
    usage: "<coin-name>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:warning:1037486469620695100> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre = args[0];

        if (!pre) return message.reply("<:warning:1037486469620695100> : Please mention an amount for the daily limit")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.daily = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The daily reward has been changed to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    daily: pre
                }).save()
                message.reply(`The daily reward has been changed to ${args[0]}`)
            }
        })
    }
}