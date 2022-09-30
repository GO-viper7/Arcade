const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')
const ms = require("ms")

module.exports = {
    name: "blacklist",
    description: "Blacklists the channel to stop earning coins",
    usage: "<channel>",
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("<:error:946775591460421683> : You do not have the \`\`ADMINISTRATOR\`\` permission that is required to run this command.")

        const params = {
            guildId: message.guild.id
        }

        const pre = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (!pre) return message.reply("<:error:946775591460421683> : Please mention a valid channel")
        
        serverConfig.findOne(params, async (err, data) => {
            if (data) {
                const blacked = data.blacklistChannels
                await blacked.push(`${pre.id}`)
                await serverConfig.findOneAndUpdate(params, data)

                message.reply(`${message.guild.channels.cache.get(pre.id)} has been whitelisted.`)
            } else {
                const blacked = [`${pre.id}`]
                new serverConfig({
                    guildId: message.guild.id,
                    blacklistChannels: blacked
                }).save()
                message.reply(`${message.guild.channels.cache.get(pre.id)} has been whitelisted.`)
            }
        })
    }
}