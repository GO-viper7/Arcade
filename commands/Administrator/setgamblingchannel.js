const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setgamblingchannel",
    description: "Sets the gambling channel.",
    usage: "<channel> or <channelid>",
    run: async (client, message, args) => {
 
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:warning:1037486469620695100> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

        if (!channel) return message.reply("<:warning:1037486469620695100> : Please mention a channel or the channel ID to configure the gambling channel in.")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.gamblingChannel = channel.id
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The channel for the gambling activities has been set to: ${channel}.\n\nIf you wish to change the gambling channel, please run this command again.`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    gamblingChannel: channel.id
                }).save()
            }
        })
    }
}