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
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            const target = message.mentions.users.first() || message.author

            const guildId = message.guild.id
            const userId = target.id

            const coins = await economy.getCoins(userId)

            const embed = new MessageEmbed()
                .setThumbnail("attachment://logo.png")
                .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
                .addFields(
                    {
                        name: `Wallet`,
                        value: `${data.emote || config.emote} ${coins} ${tBucks}`
                    }
                )
                .setColor('#FFFF00')
                .setTimestamp()
                .setFooter({ text: "Powered by Limbo Labs" })


            message.reply({ embeds: [embed], files: ["./logo.png"] })
        })
    },
}