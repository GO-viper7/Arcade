const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const xPlaying = new Set()
const economy = require("../../utils/economy.js")
const serverConfig = require("../../schemas/server-config.js")
const config = require('../../config.json')

module.exports = {
    name: "tictactoe",
    aliases: ["ttt", "xox"],
    description: "Starts a game of tic-tac-toe with another user.",
    usage: "[member] [amount]",
    run: async (client, message, args) => {
        let tBucks;
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            if (!data.gamblingChannel) return message.reply("<:warning:1037486469620695100> : There is no gambling channel set for this server. Please set one with \`setgamblingchannel\`.")
            if (message.channel.id !== data.gamblingChannel) return message.reply(`<:warning:1037486469620695100> : You must be in the gambling channel to start a game of tic-tac-toe. (${client.channels.cache.get(data.gamblingChannel)})`)

            const opponent = message.mentions.members.first()
            const amount = parseInt(args[1])

            if (!opponent) {
                return message.reply("<:warning:1037486469620695100> : Please mention a user to play against.").catch((err) => { })
            }
            if (opponent.user.id === message.author.id) {
                return message.reply("<:warning:1037486469620695100> : You can't play a game of tic-tac-toe against yourself.").catch((err) => { })
            }
            if (opponent.user.bot) {
                return message.reply("<:warning:1037486469620695100> : You cant play a game of tic-tac-toe against a bot.").catch((err) => { })
            }

            const userBal = await economy.getCoins( message.author.id)
            const opponentBal = await economy.getCoins( opponent.user.id)

            if (!amount) return message.reply(`<:warning:1037486469620695100> : Please specify an amount of ${tBucks} to bet.`).catch((err) => { })
            if (isNaN(amount)) return message.reply(`<:warning:1037486469620695100> : Please specify a valid amount of ${tBucks} to bet.`).catch((err) => { })
            if (amount > userBal) return message.reply(`<:warning:1037486469620695100> : You don't have enough ${tBucks} to bet that much.`).catch((err) => { })
            if (amount > opponentBal) return message.reply(`<:warning:1037486469620695100> : That user doesn't have enough ${tBucks} to bet that much.`).catch((err) => { })

            xPlaying.add(message.author.id + message.id)
            xPlaying.add(opponent.user.id + message.id)

            let a1 = '⬜'
            let a2 = '⬜'
            let a3 = '⬜'
            let a4 = '⬜'
            let a5 = '⬜'
            let a6 = '⬜'
            let a7 = '⬜'
            let a8 = '⬜'
            let a9 = '⬜'

            const new1 = new MessageActionRow().addComponents(
                grey1 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey1")
                    .setEmoji("➖"),

                grey2 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey2")
                    .setEmoji("➖"),

                grey3 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey3")
                    .setEmoji("➖"),
            )

            const new2 = new MessageActionRow().addComponents(
                grey4 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey4")
                    .setEmoji("➖"),

                grey5 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey5")
                    .setEmoji("➖"),

                grey6 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey6")
                    .setEmoji("➖"),
            )

            const new3 = new MessageActionRow().addComponents(
                grey7 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey7")
                    .setEmoji("➖"),

                grey8 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey8")
                    .setEmoji("➖"),

                grey9 = new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("grey9")
                    .setEmoji("➖"),
            )

            const embed = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle("Tic-Tac-Toe Game!")
                .setDescription(`**${message.author.tag} :vs: ${opponent.user.tag}**`)
                .setColor("FFFF00")
                .setFooter({ text: `Powered by Limbo Labs` })

            const initial = await message.reply({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })



            const xcollector = initial.createMessageComponentCollector({
                componentType: "BUTTON",
            })

            xcollector.on("collect", async (interaction) => {
                if (xPlaying.has(message.author.id + message.id)) {
                    if (interaction.user.id === message.author.id) {
                        if (interaction.customId === "grey1") {
                            new1.components[0].setStyle("PRIMARY").setEmoji("❌").setCustomId("x1").setDisabled(true)
                            a1 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        } else if (interaction.customId === "grey2") {
                            new1.components[1].setStyle("PRIMARY").setEmoji("❌").setCustomId("x2").setDisabled(true)
                            a2 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        } else if (interaction.customId === "grey3") {
                            new1.components[2].setStyle("PRIMARY").setEmoji("❌").setCustomId("x3").setDisabled(true)
                            a3 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        } else if (interaction.customId === "grey4") {
                            new2.components[0].setStyle("PRIMARY").setEmoji("❌").setCustomId("x4").setDisabled(true)
                            a4 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        } else if (interaction.customId === "grey5") {
                            new2.components[1].setStyle("PRIMARY").setEmoji("❌").setCustomId("x5").setDisabled(true)
                            a5 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        } else if (interaction.customId === "grey6") {
                            new2.components[2].setStyle("PRIMARY").setEmoji("❌").setCustomId("x6").setDisabled(true)
                            a6 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        } else if (interaction.customId === "grey7") {
                            new3.components[0].setStyle("PRIMARY").setEmoji("❌").setCustomId("x7").setDisabled(true)
                            a7 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        } else if (interaction.customId === "grey8") {
                            new3.components[1].setStyle("PRIMARY").setEmoji("❌").setCustomId("x8").setDisabled(true)
                            a8 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        } else if (interaction.customId === "grey9") {
                            new3.components[2].setStyle("PRIMARY").setEmoji("❌").setCustomId("x9").setDisabled(true)
                            a9 = "x"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.delete(message.author.id + message.id)
                        }

                        if (a1 === "x" && a2 === "x" && a3 === "x") {
                            initial.edit({ content: `${message.author} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount}\` ${tBucks}`}).catch((err) => { })
                            economy.addCoins(message.author.id, amount * 2)
                            economy.addCoins(opponent.user.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a4 === "x" && a5 === "x" && a6 === "x") {
                            initial.edit({ content: `${message.author} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount}\` ${tBucks}`}).catch((err) => { })
                            economy.addCoins(message.author.id, amount * 2)
                            economy.addCoins(opponent.user.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a7 === "x" && a8 === "x" && a9 === "x") {
                            initial.edit({ content: `${message.author} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount}\` ${tBucks}`}).catch((err) => { })
                            economy.addCoins(message.author.id, amount * 2)
                            economy.addCoins(opponent.user.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a1 === "x" && a4 === "x" && a7 === "x") {
                            initial.edit({ content: `${message.author} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount}\` ${tBucks}`}).catch((err) => { })
                            economy.addCoins(message.author.id, amount * 2)
                            economy.addCoins(opponent.user.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a2 === "x" && a5 === "x" && a8 === "x") {
                            initial.edit({ content: `${message.author} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount}\` ${tBucks}`}).catch((err) => { })
                            economy.addCoins(message.author.id, amount * 2)
                            economy.addCoins(opponent.user.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a3 === "x" && a6 === "x" && a9 === "x") {
                            initial.edit({ content: `${message.author} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount}\` ${tBucks}`}).catch((err) => { })
                            economy.addCoins(message.author.id, amount * 2)
                            economy.addCoins(opponent.user.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a1 === "x" && a5 === "x" && a9 === "x") {
                            initial.edit({ content: `${message.author} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount}\` ${tBucks}`}).catch((err) => { })
                            economy.addCoins(message.author.id, amount * 2)
                            economy.addCoins(opponent.user.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a3 === "x" && a5 === "x" && a7 === "x") {
                            initial.edit({ content: `${message.author} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount}\` ${tBucks}`}).catch((err) => { })
                            economy.addCoins(message.author.id, amount * 2)
                            economy.addCoins(opponent.user.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a1 !== '⬜' &&
                            a2 !== '⬜' &&
                            a3 !== '⬜' &&
                            a4 !== '⬜' &&
                            a5 !== '⬜' &&
                            a6 !== '⬜' &&
                            a7 !== '⬜' &&
                            a8 !== '⬜' &&
                            a9 !== '⬜') {
                            message.channel.send("Tie!")
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else return
                    } else if (interaction.user.id === opponent.user.id) {
                        interaction.reply({ content: "Wait for your turn!", ephemeral: true }).catch((err) => { })
                    } else {
                        interaction.reply({ content: "This is not your game!", ephemeral: true }).catch((err) => { })
                    }
                } else if (!xPlaying.has(message.author.id)) {
                    if (interaction.user.id === message.author.id) {
                        interaction.reply({ content: "Wait for your turn!", ephemeral: true }).catch((err) => { })
                    } else if (interaction.user.id === opponent.user.id) {
                        if (interaction.customId === "grey1") {
                            new1.components[0].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o1").setDisabled(true)
                            a1 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        } else if (interaction.customId === "grey2") {
                            new1.components[1].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o2").setDisabled(true)
                            a2 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        } else if (interaction.customId === "grey3") {
                            new1.components[2].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o3").setDisabled(true)
                            a3 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        } else if (interaction.customId === "grey4") {
                            new2.components[0].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o4").setDisabled(true)
                            a4 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        } else if (interaction.customId === "grey5") {
                            new2.components[1].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o5").setDisabled(true)
                            a5 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        } else if (interaction.customId === "grey6") {
                            new2.components[2].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o6").setDisabled(true)
                            a6 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        } else if (interaction.customId === "grey7") {
                            new3.components[0].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o7").setDisabled(true)
                            a7 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        } else if (interaction.customId === "grey8") {
                            new3.components[1].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o8").setDisabled(true)
                            a8 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        } else if (interaction.customId === "grey9") {
                            new3.components[2].setStyle("PRIMARY").setEmoji("⭕").setCustomId("o9").setDisabled(true)
                            a9 = "o"
                            interaction.update({ embeds: [embed], components: [new1, new2, new3] }).catch((err) => { })
                            xPlaying.add(message.author.id + message.id)
                        }


                        if (a1 === "o" && a2 === "o" && a3 === "o") {
                            initial.edit({ content: `${opponent.user} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount} ${tBucks}\`` }).catch((err) => { })
                            economy.addCoins(opponent.user.id, amount * 2)
                            economy.addCoins(message.author.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a4 === "o" && a5 === "o" && a6 === "o") {
                            initial.edit({ content: `${opponent.user} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount} ${tBucks}\`` }).catch((err) => { })
                            economy.addCoins(opponent.user.id, amount * 2)
                            economy.addCoins(message.author.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a7 === "o" && a8 === "o" && a9 === "o") {
                            initial.edit({ content: `${opponent.user} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount} ${tBucks}\`` }).catch((err) => { })
                            economy.addCoins(opponent.user.id, amount * 2)
                            economy.addCoins(message.author.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a1 === "o" && a4 === "o" && a7 === "o") {
                            initial.edit({ content: `${opponent.user} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount} ${tBucks}\`` }).catch((err) => { })
                            economy.addCoins(opponent.user.id, amount * 2)
                            economy.addCoins(message.author.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a2 === "o" && a5 === "o" && a8 === "o") {
                            initial.edit({ content: `${opponent.user} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount} ${tBucks}\`` }).catch((err) => { })
                            economy.addCoins(opponent.user.id, amount * 2)
                            economy.addCoins(message.author.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a3 === "o" && a6 === "o" && a9 === "o") {
                            initial.edit({ content: `${opponent.user} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount} ${tBucks}\`` }).catch((err) => { })
                            economy.addCoins(opponent.user.id, amount * 2)
                            economy.addCoins(message.author.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a1 === "o" && a5 === "o" && a9 === "o") {
                            initial.edit({ content: `${opponent.user} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount} ${tBucks}\`` }).catch((err) => { })
                            economy.addCoins(opponent.user.id, amount * 2)
                            economy.addCoins(message.author.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a3 === "o" && a5 === "o" && a7 === "o") {
                            initial.edit({ content: `${opponent.user} wins!\n\nCoins won: ${data.emote || config.emote}\`${amount * 2} ${tBucks}\`\nCoins lost: ${data.emote || config.emote} \`${amount} ${tBucks}\`` }).catch((err) => { })
                            economy.addCoins(opponent.user.id, amount * 2)
                            economy.addCoins(message.author.id, amount * -1)
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else if (a1 !== '⬜' &&
                            a2 !== '⬜' &&
                            a3 !== '⬜' &&
                            a4 !== '⬜' &&
                            a5 !== '⬜' &&
                            a6 !== '⬜' &&
                            a7 !== '⬜' &&
                            a8 !== '⬜' &&
                            a9 !== '⬜') {
                            message.channel.send("Tie!")
                            xcollector.stop()
                            xPlaying.delete(opponent.user.id + message.id)
                            xPlaying.delete(message.author.id + message.id)
                        } else return
                    } else {
                        interaction.reply({ content: "This is not your game!", ephemeral: true }).catch((err) => { })
                    }
                }
            })
        })
    }
}