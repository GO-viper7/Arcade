const economy = require('../../utils/economy')
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "daily",
    description: "Gives you your daily tBucks.",
    timeout: 86400000,
    run: async (client, message, args) => {
        let tBucks;
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            console.log(data);
            if (!data.userChannel) return message.reply("Please set the user channel using the \`setuserchannel\` command.")
            if (message.channel.id !== data.userChannel) return message.reply(`Please run this command in the user channel. (${client.channels.cache.get(data.userChannel)})`)

            function randomNumber(min, max) {
                return Math.round(Math.random() * (max - min) + min);
            }

            const amount = randomNumber(200, 400)

            economy.addCoins(message.guild.id, message.author.id, amount)

            return message.reply(`You received your daily ${tBucks}!\n\n<:Coins:946757996166389810> \`${amount} ${tBucks}\``)
        })
    }
}