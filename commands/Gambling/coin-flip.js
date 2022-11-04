const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const economy = require("../../utils/economy.js")
const serverConfig = require("../../schemas/server-config.js")
const config = require('../../config.json')

module.exports = {
    name: "coinflip",
    description: "Flips a coin and gives you a tBucks reward.",
    aliases: ["flipcoin", "flip"],
    usage: "[member] [amount]",
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

            const opponent = message.mentions.members.first()
            const amount = parseInt(args[1])

            if (!opponent) return message.reply("<:warning:1037486469620695100> : Please specify a valid member!")
            if (opponent.user.id === message.author.id) {
                return message.reply("<:warning:1037486469620695100> : You can't flip a coin against yourself.").catch((err) => { })
            }
            if (opponent.user.bot) {
                return message.reply("<:warning:1037486469620695100> : You cant flip a coin against a bot.").catch((err) => { })
            }
            if (!amount) return message.reply(`<:warning:1037486469620695100> : Please specify an amount of ${tBucks} to bet on this coin flip.`)
            if (isNaN(amount)) return message.reply(`<:warning:1037486469620695100> : Please specify a valid amount of ${tBucks} to bet on this coin flip.`)

            const userCoins = await economy.getCoins( message.author.id)
            const opponentCoins = await economy.getCoins( opponent.id)

            if (amount > userCoins) return message.reply(`<:warning:1037486469620695100> : You do not have enough ${tBucks} to bet that much!`)
            if (amount > opponentCoins) return message.reply(`<:warning:1037486469620695100> : That member does not have enough ${tBucks} to bet that much!`)

            const inviterow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle("SUCCESS")
                    .setCustomId("accept")
                    .setLabel("Accept")
                    .setEmoji("✅"),

                new MessageButton()
                    .setStyle("DANGER")
                    .setCustomId("decline")
                    .setLabel("Decline")
                    .setEmoji("❌")
            )

            const initalEmbed = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle("Coin Flip!")
                .setDescription(`${message.author.tag} has challenged ${opponent.user.tag} to a coin flip!`)
                .setFooter({ text: `Powered by Limbo Labs` })
                .setColor("#FFFF00")

            const initialMessage = await message.reply({ embeds: [initalEmbed], components: [inviterow] })

            const filter = (interaction) => {
                if (interaction.user.id === opponent.user.id) return true;
                return interaction.reply({
                    content: `Only ${opponent.user.tag} can use this interaction!`,
                    ephemeral: true,
                });
            };

            const inviteCollector = initialMessage.createMessageComponentCollector({
                filter,
                componentType: "BUTTON",
                time: 60000,
            })

            inviteCollector.on("collect", async (interaction) => {
                if (interaction.customId === "accept") {
                    const choiceEmbed = new MessageEmbed()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTitle("Coin Flip!")
                        .setDescription(`${opponent} - Choose your side!`)
                        .setColor("#FFFF00")
                        .setFooter({ text: `Powered by Limbo Labs` })

                    const choiceRow = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setStyle("PRIMARY")
                            .setCustomId("heads")
                            .setLabel("Heads"),

                        new MessageButton()
                            .setStyle("PRIMARY")
                            .setCustomId("tails")
                            .setLabel("Tails")
                    )

                    await interaction.update({ embeds: [choiceEmbed], components: [choiceRow] })
                    await inviteCollector.stop()

                    const choiceCollector = initialMessage.createMessageComponentCollector({
                        filter,
                        componentType: "BUTTON",
                        time: 60000,
                    })

                    const outcomes = ["heads", "tails"]
                    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]

                    await choiceCollector.on("collect", async (interaction) => {
                        if (interaction.customId === "heads") {
                            if (outcome === "heads") {
                                const winEmbed = new MessageEmbed()
                                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                                    .setTitle("Coin Flip!")
                                    .setDescription(`The outcome was \`Heads\`!\n\n${opponent.user.tag} won and ${message.author.tag} lost the coin flip!\n\n${data.emote || config.emote} \`${amount}\` ${tBucks} have been added to ${message.author}'s account and ${data.emote || config.emote} \`${amount}\` ${tBucks} have been removed from ${opponent}'s account.`)
                                    .setColor("#FFFF00")
                                    .setFooter({ text: `Powered by Limbo Labs` })

                                choiceRow.components[0].setStyle("PRIMARY").setDisabled(true)
                                choiceRow.components[1].setStyle("SECONDARY").setDisabled(true)
                                await interaction.update({ embeds: [winEmbed], components: [choiceRow] })
                                await economy.addCoins(message.author.id, amount * -1)
                                await economy.addCoins(opponent.user.id, amount)

                            } else if (outcome === "tails") {
                                const loseEmbed = new MessageEmbed()
                                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                                    .setTitle("Coin Flip!")
                                    .setDescription(`The outcome was \`Tails\`!\n\n${opponent.user.tag} lost and ${message.author.tag} won the coin flip!\n\n${data.emote || config.emote} \`${amount}\` ${tBucks} have been removed from ${message.author}'s account and ${data.emote || config.emote} \`${amount}\`  ${tBucks} have been added to ${opponent}'s account.`)
                                    .setColor("#FFFF00")
                                    .setFooter({ text: `Powered by Limbo Labs` })

                                choiceRow.components[0].setStyle("PRIMARY").setDisabled(true)
                                choiceRow.components[1].setStyle("SECONDARY").setDisabled(true)
                                await interaction.update({ embeds: [loseEmbed], components: [choiceRow] })
                                await economy.addCoins(message.author.id, amount)
                                await economy.addCoins(opponent.user.id, amount * -1)

                            }
                        } else if (interaction.customId === "tails") {
                            if (outcome === "tails") {
                                const winEmbed = new MessageEmbed()
                                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                                    .setTitle("Coin Flip!")
                                    .setDescription(`The outcome was \`Tails\`!\n\n${opponent.user.tag} won and ${message.author.tag} lost the coin flip!\n\n${data.emote || config.emote} \`${amount}\`  ${tBucks} have been added to ${message.author}'s account and ${data.emote || config.emote} \`${amount}\` ${tBucks} have been removed from ${opponent}'s account.`)
                                    .setColor("#FFFF00")
                                    .setFooter({ text: `Powered by Limbo Labs` })

                                choiceRow.components[0].setStyle("SECONDARY").setDisabled(true)
                                choiceRow.components[1].setStyle("PRIMARY").setDisabled(true)
                                await interaction.update({ embeds: [winEmbed], components: [choiceRow] })
                                await economy.addCoins(message.author.id, amount * -1)
                                await economy.addCoins(opponent.user.id, amount)

                            } else if (outcome === "heads") {
                                const loseEmbed = new MessageEmbed()
                                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                                    .setTitle("Coin Flip!")
                                    .setDescription(`The outcome was \`Heads\`!\n\n${opponent.user.tag} lost and ${message.author.tag} won the coin flip!\n\n${data.emote || config.emote} \`${amount}\` ${tBucks} have been removed from ${message.author}'s account and ${data.emote || config.emote} \`${amount}\`  ${tBucks} have been added to ${opponent}'s account.`)
                                    .setColor("#FFFF00")
                                    .setFooter({ text: `Powered by Limbo Labs` })

                                choiceRow.components[0].setStyle("SECONDARY").setDisabled(true)
                                choiceRow.components[1].setStyle("PRIMARY").setDisabled(true)
                                await interaction.update({ embeds: [loseEmbed], components: [choiceRow] })
                                await economy.addCoins(message.author.id, amount)
                                await economy.addCoins(opponent.user.id, amount * -1)

                            }
                        }
                    })
                } else if (interaction.customId === "decline") {
                    const declineEmbed = new MessageEmbed()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTitle("Coin Flip Declined!")
                        .setDescription(`${opponent.user.tag} has declined the coin flip!`)
                        .setFooter({ text: `Powered by Limbo Labs` })
                        .setColor("#FFFF00")

                    await inviteCollector.stop()
                    interaction.update({ embeds: [declineEmbed] })
                }
            })
        })
    }
}