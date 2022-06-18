const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "setshoplogs",
    description: "Sets the shop logs channel.",
    usage: "<channel> or <channelid>",
    run: async (client, message, args) => {
        let tBucks;

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:error:946775591460421683> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

        if (!channel) return message.reply("<:error:946775591460421683> : Please mention a channel or the channel ID to configure the shop logs in.")
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                data.shopLogs = channel.id
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`The channel for the shop logs has been set to: ${channel}.\n\nIf you wish to change the shop logs channel, please run this command again.`)
            } else {
                new serverConfig({
                    guildId: message.guild.id,
                    shopLogs: channel.id
                }).save()
            }
        })
    }
}