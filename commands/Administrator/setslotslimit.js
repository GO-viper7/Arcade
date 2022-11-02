const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setslotslimit",
    description: "Sets the limit a user can bet on the Slots game.",
    usage: "<limit>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:warning:1037486469620695100> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")
        
        const params = {
            guildId: message.guild.id
        }

        const pre= args[0];

        if (!pre) return message.reply("<:warning:1037486469620695100> : Please mention a limit for the game")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.slotsLimit = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The maximum limit for the bet is set to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    slotsLimit: pre
                }).save()
            }
        })
    }
}