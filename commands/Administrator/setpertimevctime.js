const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')
const ms = require("ms")

module.exports = {
    name: "setpertimevctime",
    description: "Sets the per time earning of vc time",
    usage: "<coin-name>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:warning:1037486469620695100> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre = ms(args[0]);

        if (!pre) return message.reply("<:warning:1037486469620695100> : Please mention a time for per time earning coins")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.pertimevctime = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The minimum VC time has been changed to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    pertimevctime: pre
                }).save()
                message.reply(`The minimum VC time has been changed to ${args[0]}`)
            }
        })
    }
}