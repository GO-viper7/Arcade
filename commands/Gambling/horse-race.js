const { MessageEmbed } = require("discord.js")
const economy = require("../../utils/economy")
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json');

module.exports = {
    name: 'horse-race',
    aliases: ["horserace", "horsebet", "horse"],
    description: "Place bets on horse race!",
    usage: "<horse number> <amount>",
    run: async (client, message, args) => {
    let tBucks;
    
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            if (!data.gamblingChannel) return message.reply("Please set the gambling channel using \`setgamblingchannel\` command.")
            if (data.gamblingChannel !== message.channel.id) return message.reply(`Please run this command in the gambling channel. (${client.channels.cache.get(data.gamblingChannel)})`)
            const amount = args[1]

            if (!args[0]) return message.reply("You need to specify a horse number!")
            if (!args[1]) return message.reply(`You need to specify an amount of ${tBucks} to bet!`)
            if (isNaN(args[0])) return message.reply("You need to specify a valid horse number!")
            if (isNaN(args[1])) return message.reply(`You need to specify a valid amount of ${tBucks} to bet!`)
            if (args[0] < 1 || args[0] > 5) return message.reply("You need to specify a valid horse number!")
            if (args[1] < 1) return message.reply(`You need to specify a valid amount of ${tBucks} to bet!`)

            const userBal = await economy.getCoins(message.guild.id, message.author.id)
            if (args[1] > userBal) return message.reply(`You don't have enough ${tBucks} to bet!`)
            const horse_number = parseInt(args[0])
            if (horse_number > 5) return message.reply("You need to specify a valid horse number from \`1-5\`!")

            let length = 20
            let length_1 = 20
            let length_2 = 20
            let length_3 = 20
            let length_4 = 20
            let length_5 = 20
            let length_6 = 20
            let length_7 = 20
            let length_8 = 20
            let length_9 = 20
            let length_10 = 20

            const racetrack = ("-").repeat(length)
            const horse_1 = "🏇"
            const horse_2 = "🏇"
            const horse_3 = "🏇"
            const horse_4 = "🏇"
            const horse_5 = "🏇"
            const horse_6 = "🏇"
            const horse_7 = "🏇"
            const horse_8 = "🏇"
            const horse_9 = "🏇"
            const horse_10 = "🏇"


            const flag = "🏁"

            const embed = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle("Horse Racing")
                .setDescription(`Place your bets on the horse!\n\n1. ${flag} ${racetrack} ${horse_1}\n\n2. ${flag} ${racetrack} ${horse_2}\n\n3. ${flag} ${racetrack} ${horse_3}\n\n4. ${flag} ${racetrack} ${horse_4}\n\n5. ${flag} ${racetrack} ${horse_5}`)
                .setColor("#FFFF00")
            const array = [0, 1, 2]


            message.reply({ embeds: [embed] }).then(async msg => {
                const interval = setInterval(async () => {
                    const movement_1 = array[Math.floor(Math.random() * array.length)]
                    const movement_2 = array[Math.floor(Math.random() * array.length)]
                    const movement_3 = array[Math.floor(Math.random() * array.length)]
                    const movement_4 = array[Math.floor(Math.random() * array.length)]
                    const movement_5 = array[Math.floor(Math.random() * array.length)]
                    const movement_6 = array[Math.floor(Math.random() * array.length)]
                    const movement_7 = array[Math.floor(Math.random() * array.length)]
                    const movement_8 = array[Math.floor(Math.random() * array.length)]
                    const movement_9 = array[Math.floor(Math.random() * array.length)]
                    const movement_10 = array[Math.floor(Math.random() * array.length)]

                    length_1 = length_1 - movement_1
                    length_2 = length_2 - movement_2
                    length_3 = length_3 - movement_3
                    length_4 = length_4 - movement_4
                    length_5 = length_5 - movement_5
                    length_6 = length_6 - movement_6
                    length_7 = length_7 - movement_7
                    length_8 = length_8 - movement_8
                    length_9 = length_9 - movement_9
                    length_10 = length_10 - movement_10

                    if (length_1 <= 0) {
                        await clearInterval(interval)
                        if (horse_number === 1) {
                            await economy.addCoins(message.guild.id, message.author.id, amount * 5)
                            await message.reply(`Horse 1 won the race! You won <:Coins:946757996166389810>\`${amount * 5} ${tBucks}!\``)
                        } else {
                            await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                            await message.reply(`Horse 1 won the race! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                        }
                    } else if (length_2 <= 0) {
                        await clearInterval(interval)
                        if (horse_number === 2) {
                            await economy.addCoins(message.guild.id, message.author.id, amount * 5)
                            await message.reply(`Horse 2 won the race! You won <:Coins:946757996166389810>\`${amount * 5} ${tBucks}!\``)
                        } else {
                            await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                            await message.reply(`Horse 2 won the race! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                        }
                    } else if (length_3 <= 0) {
                        await clearInterval(interval)
                        if (horse_number === 3) {
                            await economy.addCoins(message.guild.id, message.author.id, amount * 5)
                            await message.reply(`Horse 3 won the race! You won <:Coins:946757996166389810>\`${amount * 5} ${tBucks}!\``)
                        } else {
                            await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                            message.reply(`Horse 3 won the race! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                        }
                    } else if (length_4 <= 0) {
                        await clearInterval(interval)
                        if (horse_number === 4) {
                            await economy.addCoins(message.guild.id, message.author.id, amount * 5)
                            await message.reply(`Horse 4 won the race! You won <:Coins:946757996166389810>\`${amount * 5} ${tBucks}!\``)
                        } else {
                            await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                            message.reply(`Horse 4 won the race! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                        }
                    } else if (length_5 <= 0) {
                        await clearInterval(interval)
                        if (horse_number === 5) {
                            await economy.addCoins(message.guild.id, message.author.id, amount * 5)
                            await message.reply(`Horse 5 won the race! You won <:Coins:946757996166389810>\`${amount * 5} ${tBucks}!\``)
                        } else {
                            await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                            message.reply(`Horse 5 won the race! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                        }
                    } else if (length_6 <= 0) {
                        await clearInterval(interval)
                        await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                        message.reply(`You predicted the wrong horse! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                    } else if (length_7 <= 0) {
                        await clearInterval(interval)
                        await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                        message.reply(`You predicted the wrong horse! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                    }
                    else if (length_8 <= 0) {
                        await clearInterval(interval)
                        await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                        message.reply(`You predicted the wrong horse! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                    }
                    else if (length_9 <= 0) {
                        await clearInterval(interval)
                        await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                        message.reply(`You predicted the wrong horse! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                    }
                    else if (length_10 <= 0) {
                        await clearInterval(interval)
                        await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                        message.reply(`You predicted the wrong horse! You lost <:Coins:946757996166389810>\`-${amount} ${tBucks}!\``)
                    }

                    embed.setDescription(`Place your bets on the horse!\n\n1. ${flag} ${"-".repeat(length_1)}${horse_1}\n\n2. ${flag} ${"-".repeat(length_2)}${horse_2}\n\n3. ${flag} ${"-".repeat(length_3)}${horse_3}\n\n4. ${flag} ${"-".repeat(length_4)}${horse_4}\n\n5. ${flag} ${length_5>=0 ? "-".repeat(length_5) : "-".repeat(0)}${horse_5}`)

                    msg.edit({ embeds: [embed] })
                }, 1000)
            })
        })
    }
}