const { MessageEmbed } = require("discord.js")
const economy = require("../../utils/economy")
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "slot",
    aliases: ["slots", "slotmachine"],
    usage: '<amount>',
    description: 'Starts a game of Slots with the bot.',
    run: async (client, message, args) => {
        let tBucks;
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
                const limit = data.slotsLimit
                if (!limit) {
                    if (!data.gamblingChannel) return message.reply("Please set the gambling channel using \`setgamblingchannel\` command.")
                    if (data.gamblingChannel !== message.channel.id) return message.reply(`Please run this command in the gambling channel. (${client.channels.cache.get(data.gamblingChannel)})`)

                    if (!args[0]) return message.channel.send(`You need to specify an amount of ${tBucks} to gamble!`)
                    if (isNaN(args[0])) return message.channel.send(`You need to specify a valid amount of ${tBucks} to gamble!`)
                    if (args[0] < 1) return message.channel.send(`You need to specify an amount of ${tBucks} to gamble!`)

                    const userBal = await economy.getCoins(message.author.id)
                    if (args[0] > userBal) return message.channel.send(`You don't have enough ${tBucks} to gamble!`)

                    const choices = ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍒", "🍍", "🍎", "🍏", "🍑", "🍓"]
                    const selection_1 = choices[Math.floor(Math.random() * choices.length)].toString()
                    const selection_2 = choices[Math.floor(Math.random() * choices.length)].toString()
                    const selection_3 = choices[Math.floor(Math.random() * choices.length)].toString()

                    function probability(n) {
                        return Math.random() < n;
                    }

                    if (selection_1 === selection_2 && selection_2 === selection_3) {
                        if (probability(0.01)) {
                            const jackpotEmbed = new MessageEmbed()
                                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                                .setTitle("Jackpot!")
                                .setDescription(`7️⃣ | 7️⃣ | 7️⃣\n\nYou won the jackpot! You won ${data.emote || config.emote}\`${args[0] * 10} ${tBucks}\`!`)
                                .setColor("FFFF00")
                                .setTimestamp()
                                .setFooter({ text: `Powered by Limbo Labs` })

                            await economy.addCoins(message.guild.id, message.author.id, args[0] * 10)
                            message.reply({ embeds: [jackpotEmbed] })
                        } else {
                            const winnerEmbed = new MessageEmbed()
                                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                                .setTitle("Winner!")
                                .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0] * 2} ${tBucks}\`!`)
                                .setColor("FFFF00")
                                .setTimestamp()
                                .setFooter({ text: `Powered by Limbo Labs` })

                            await economy.addCoins(message.guild.id, message.author.id, args[0] * 2)
                            message.reply({ embeds: [winnerEmbed] })
                        }
                    } else if (selection_1 === selection_2 && selection_2 !== selection_3) {
                        const winnerEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Winner!")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0])
                        message.reply({ embeds: [winnerEmbed] })
                    } else if (selection_1 !== selection_2 && selection_2 === selection_3) {
                        const winnerEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Winner!")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0])
                        message.reply({ embeds: [winnerEmbed] })
                    } else if (selection_1 === selection_3 && selection_3 !== selection_2) {
                        const winnerEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Winner!")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0])
                        message.reply({ embeds: [winnerEmbed] })
                    } else if (selection_1 !== selection_2 && selection_2 !== selection_3) {
                        const loserEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Loser")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou lost ${data.emote || config.emote}\`-${args[0]} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0] * -1)
                        message.reply({ embeds: [loserEmbed] })
                    }
                } else {
                    if (!data.gamblingChannel) return message.reply("Please set the gambling channel using \`setgamblingchannel\` command.")
                    if (data.gamblingChannel !== message.channel.id) return message.reply(`Please run this command in the gambling channel. (${client.channels.cache.get(data.gamblingChannel)})`)

                    if (!args[0]) return message.channel.send(`You need to specify an amount of ${tBucks} to gamble!`)
                    if (isNaN(args[0])) return message.channel.send(`You need to specify a valid amount of ${tBucks} to gamble!`)
                    if (args[0] < 1) return message.channel.send(`You need to specify an amount of ${tBucks} to gamble!`)
                    if (args[0] > limit) return message.reply(`You can bet only a maximum of ${limit} ${tBucks}`)
                    const userBal = await economy.getCoins(message.author.id)
                    if (args[0] > userBal) return message.channel.send(`You don't have enough ${tBucks} to gamble!`)

                    const choices = ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍒", "🍍", "🍎", "🍏", "🍑", "🍓"]
                    const selection_1 = choices[Math.floor(Math.random() * choices.length)].toString()
                    const selection_2 = choices[Math.floor(Math.random() * choices.length)].toString()
                    const selection_3 = choices[Math.floor(Math.random() * choices.length)].toString()

                    function probability(n) {
                        return Math.random() < n;
                    }

                    if (selection_1 === selection_2 && selection_2 === selection_3) {
                        if (probability(0.01)) {
                            const jackpotEmbed = new MessageEmbed()
                                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                                .setTitle("Jackpot!")
                                .setDescription(`7️⃣ | 7️⃣ | 7️⃣\n\nYou won the jackpot! You won ${data.emote || config.emote}\`${args[0] * 10} ${tBucks}\`!`)
                                .setColor("FFFF00")
                                .setTimestamp()
                                .setFooter({ text: `Powered by Limbo Labs` })

                            await economy.addCoins(message.guild.id, message.author.id, args[0] * 10)
                            message.reply({ embeds: [jackpotEmbed] })
                        } else {
                            const winnerEmbed = new MessageEmbed()
                                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                                .setTitle("Winner!")
                                .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0] * 2} ${tBucks}\`!`)
                                .setColor("FFFF00")
                                .setTimestamp()
                                .setFooter({ text: `Powered by Limbo Labs` })

                            await economy.addCoins(message.guild.id, message.author.id, args[0] * 2)
                            message.reply({ embeds: [winnerEmbed] })
                        }
                    } else if (selection_1 === selection_2 && selection_2 !== selection_3) {
                        const winnerEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Winner!")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0])
                        message.reply({ embeds: [winnerEmbed] })
                    } else if (selection_1 !== selection_2 && selection_2 === selection_3) {
                        const winnerEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Winner!")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0])
                        message.reply({ embeds: [winnerEmbed] })
                    } else if (selection_1 === selection_3 && selection_3 !== selection_2) {
                        const winnerEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Winner!")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0])
                        message.reply({ embeds: [winnerEmbed] })
                    } else if (selection_1 !== selection_2 && selection_2 !== selection_3) {
                        const loserEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Loser")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou lost ${data.emote || config.emote}\`-${args[0]} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0] * -1)
                        message.reply({ embeds: [loserEmbed] })
                    }
                }
            } else {
                tBucks = config.coin;
                if (!data.gamblingChannel) return message.reply("Please set the gambling channel using \`setgamblingchannel\` command.")
                if (data.gamblingChannel !== message.channel.id) return message.reply(`Please run this command in the gambling channel. (${client.channels.cache.get(data.gamblingChannel)})`)

                if (!args[0]) return message.channel.send(`You need to specify an amount of ${tBucks} to gamble!`)
                if (isNaN(args[0])) return message.channel.send(`You need to specify a valid amount of ${tBucks} to gamble!`)
                if (args[0] < 1) return message.channel.send(`You need to specify an amount of ${tBucks} to gamble!`)

                const userBal = await economy.getCoins(message.author.id)
                if (args[0] > userBal) return message.channel.send(`You don't have enough ${tBucks} to gamble!`)

                const choices = ["🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍒", "🍍", "🍎", "🍏", "🍑", "🍓"]
                const selection_1 = choices[Math.floor(Math.random() * choices.length)].toString()
                const selection_2 = choices[Math.floor(Math.random() * choices.length)].toString()
                const selection_3 = choices[Math.floor(Math.random() * choices.length)].toString()

                function probability(n) {
                    return Math.random() < n;
                }

                if (selection_1 === selection_2 && selection_2 === selection_3) {
                    if (probability(0.01)) {
                        const jackpotEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Jackpot!")
                            .setDescription(`7️⃣ | 7️⃣ | 7️⃣\n\nYou won the jackpot! You won ${data.emote || config.emote}\`${args[0] * 10} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0] * 10)
                        message.reply({ embeds: [jackpotEmbed] })
                    } else {
                        const winnerEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("Winner!")
                            .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0] * 2} ${tBucks}\`!`)
                            .setColor("FFFF00")
                            .setTimestamp()
                            .setFooter({ text: `Powered by Limbo Labs` })

                        await economy.addCoins(message.guild.id, message.author.id, args[0] * 2)
                        message.reply({ embeds: [winnerEmbed] })
                    }
                } else if (selection_1 === selection_2 && selection_2 !== selection_3) {
                    const winnerEmbed = new MessageEmbed()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTitle("Winner!")
                        .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                        .setColor("FFFF00")
                        .setTimestamp()
                        .setFooter({ text: `Powered by Limbo Labs` })

                    await economy.addCoins(message.guild.id, message.author.id, args[0])
                    message.reply({ embeds: [winnerEmbed] })
                } else if (selection_1 !== selection_2 && selection_2 === selection_3) {
                    const winnerEmbed = new MessageEmbed()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTitle("Winner!")
                        .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                        .setColor("FFFF00")
                        .setTimestamp()
                        .setFooter({ text: `Powered by Limbo Labs` })

                    await economy.addCoins(message.guild.id, message.author.id, args[0])
                    message.reply({ embeds: [winnerEmbed] })
                } else if (selection_1 === selection_3 && selection_3 !== selection_2) {
                    const winnerEmbed = new MessageEmbed()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTitle("Winner!")
                        .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou won ${data.emote || config.emote}\`${args[0]} ${tBucks}\`!`)
                        .setColor("FFFF00")
                        .setTimestamp()
                        .setFooter({ text: `Powered by Limbo Labs` })

                    await economy.addCoins(message.guild.id, message.author.id, args[0])
                    message.reply({ embeds: [winnerEmbed] })
                } else if (selection_1 !== selection_2 && selection_2 !== selection_3) {
                    const loserEmbed = new MessageEmbed()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTitle("Loser")
                        .setDescription(`${selection_1} | ${selection_2} | ${selection_3}\n\nYou lost ${data.emote || config.emote}\`-${args[0]} ${tBucks}\`!`)
                        .setColor("FFFF00")
                        .setTimestamp()
                        .setFooter({ text: `Powered by Limbo Labs` })

                    await economy.addCoins(message.guild.id, message.author.id, args[0] * -1)
                    message.reply({ embeds: [loserEmbed] })
                }
            }
        })
    }
}