const economy = require('../../utils/economy')
const { MessageEmbed } = require('discord.js')
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: 'balance',
    description: "Shows yours or the mentioned member's balance.",
    aliases: ['bal'],
    usage: "<member>",
    run: async (client, message, args) => {
        let tBucks;
    serverConfig.findOne({guildId: message.guild.id}, async (err, data) => {
        if (data) {
            tBucks = data.coin;
        } else {
            tBucks = config.coin;
        }
        const target = message.mentions.users.first() || message.author

        const guildId = message.guild.id
        const userId = target.id

        const coins = await economy.getCoins(guildId, userId)

        const embed = new MessageEmbed()
            .setThumbnail("https://cdn.discordapp.com/attachments/945844991744426014/946512213806575636/creature_7_1.png")
            .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
            .addFields(
                {
                    name: `Wallet`,
                    value: `<:Coins:946757996166389810> ${coins} ${tBucks}`
                }
            )
            .setColor('#FFFF00')
            .setTimestamp()


        message.reply({ embeds: [embed] })
            })
    },
}