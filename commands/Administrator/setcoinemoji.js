const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setcoinemoji",
    description: "Sets the emoji of the coin.",
    usage: "<emoji-name>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:error:946775591460421683> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre= args[0];

        if (!pre) return message.reply("<:error:946775591460421683> : Please mention a specific emoji for the Coins")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.emote = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`Emoji of the coin has been successfully changed to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    emote: pre
                }).save()
            }
        })
    }
}