const client = require("../index")
const profileSchema = require('../schemas/profile-schema')
const serverConfig = require('../schemas/server-config')
const economy = require("../utils/economy")
const { Collection } = require("discord.js")
const Timeout = new Collection

client.on("messageCreate", async (message) => {
    const userId = message.author.id
    const guildId = message.guild.id

    if (message.author.bot) return

    serverConfig.findOne({ guildId: guildId }, async (err, data) => {
        if (!data) return
        if (message.content.startsWith(".")) return
        if (data.blacklistChannels.includes(message.channel.id)) return;

        let timeout = data.chatTimeout;

        if (Timeout.has(`throw ${userId}`)) {
            return
        } else {
            Timeout.set(`throw ${userId}`, Date.now() + timeout)
            setTimeout(() => {
                Timeout.delete(`throw ${userId}`)
            }, timeout)
            const chatCoins = data.chatCoins
            await economy.addCoins(guildId, userId, chatCoins)
        }
    })
})