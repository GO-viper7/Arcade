const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setcoin",
    description: "Sets the name of the coin.",
    usage: "<coin-name>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:warning:1037486469620695100> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre= args[0];

        if (!pre) return message.reply("<:warning:1037486469620695100> : Please mention a specific name for the Coins")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.coin = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`Name of the coin has been successfully changed to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    coin: pre
                }).save()
            }
        })
    }
}