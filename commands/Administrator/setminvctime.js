const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')
const ms = require("ms")

module.exports = {
    name: "setminvctime",
    description: "Sets the minimum amount of vc time required to start earning coins.",
    usage: "<coin-name>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:error:946775591460421683> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre = ms(args[0]);

        if (!pre) return message.reply("<:error:946775591460421683> : Please mention a time for start earning coins")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.minvctime = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The minimum VC time has been changed to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    minvctime: pre
                }).save()
                message.reply(`The minimum VC time has been changed to ${args[0]}`)
            }
        })
    }
}