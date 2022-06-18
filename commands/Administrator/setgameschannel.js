const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setgameschannel",
    aliases: ["setgamechannel"],
    description: "Sets the gaming channel.",
    usage: "<channel> or <channelid>",
    run: async (client, message, args) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:error:946775591460421683> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

        if (!channel) return message.reply("<:error:946775591460421683> : Please mention a channel or the channel ID to configure the gameing channel in.")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.gamesChannel = channel.id
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The channel for the gambling activities has been set to: ${channel}.\n\nIf you wish to change the gambling channel, please run this command again.`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    gamesChannel: channel.id
                }).save()
            }
        })
    }
}