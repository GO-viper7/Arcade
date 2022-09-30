const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setrpslimit",
    description: "Sets the limit a user can bet on the Rock, Paper, Scissiors game.",
    usage: "<limit>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:error:946775591460421683> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre= args[0];

        if (!pre) return message.reply("<:error:946775591460421683> : Please mention a limit for the game")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.rpsLimit = pre
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The maximum limit for the bet is set to ${args[0]}`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    rpsLimit: pre
                }).save()
            }
        })
    }
}