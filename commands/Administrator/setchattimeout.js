const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')
const ms = require("ms")

module.exports = {
    name: "setchattimeout",
    description: "Sets the amount of time it takes between two messages to give the coins.",
    usage: "5s",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:warning:1037486469620695100> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre = ms(args[0]);
        if (!pre) return message.reply("<:warning:1037486469620695100> : Please mention a valid time limit")
        
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.chatTimeout = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The chat timeout has been changed to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    chatTimeout: pre
                }).save()
                message.reply(`The chat timeout has been changed to ${args[0]}`)
            }
        })
    }
}