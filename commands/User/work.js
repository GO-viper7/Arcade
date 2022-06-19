const { Collection, MessageAttachment, MessageEmbed } = require('discord.js')
const economy = require('../../utils/economy')
const workTimeout = new Collection()
const ms = require("ms")
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: 'work',
    description: "Work to earn some extra tBucks.",
    run: async (client, message, args) => {
        let tBucks;
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            if (!data.userChannel) return message.reply("Please set the user channel using the \`setuserchannel\` command.")
            if (message.channel.id !== data.userChannel) return message.reply(`Please run this command in the user channel. (${client.channels.cache.get(data.userChannel)})`)

            let timeout = 60000 * 60

            if (workTimeout.has(message.author.id)) {
                const tiredEmbed = new MessageEmbed()
                    .setColor('#FFFF00')
                    .setThumbnail("https://cdn.discordapp.com/attachments/942755207748661248/946843553793982554/sussie_lol.gif")
                    .setDescription(`Don't work too much! Come back after \`${ms(workTimeout.get(message.author.id) - Date.now(), { long: true })}\`!`)
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                return message.reply({ embeds: [tiredEmbed] })
            } else {
                workTimeout.set(message.author.id, Date.now() + timeout)
                setTimeout(() => {
                    workTimeout.delete(message.author.id)
                }, timeout)

                const jobs = [`Programmer 🧑‍💻`, `Mason 🧱`, `YouTuber 📽️`, `Waiter 🍖`, `Doctor 🧑‍⚕️`, `Mechanic 🧑‍🔧`]


                const amount = 20

                economy.addCoins(message.guild.id, message.author.id, amount)

                const embed = new MessageEmbed()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`You worked as a ${jobs[Math.floor(Math.random() * jobs.length)]} and earned ${data.emote || config.emote}\`${amount} ${tBucks}\`!`)
                    .setColor("FFFF00")
                    .setThumbnail("https://media.discordapp.net/attachments/945844991744426014/946512249659457566/farmer1_1.png?width=200&height=200")


                return message.reply({ embeds: [embed] })

            }
        })
    }
}