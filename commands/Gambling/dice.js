const economy = require("../../utils/economy")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "dice",
    description: "Rolls a dice along with the mentioned user. The user with a higher number wins.",
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
            const amount = args[1]

            if (!opponent) return message.reply("<:error:946775591460421683> : Please mention a member to roll the dice with.")
            if (opponent.user.id === message.author.id) {
                return message.reply("<:error:946775591460421683> : You can't roll a die against yourself.").catch((err) => { })
            }
            if (opponent.user.bot) {
                return message.reply("<:error:946775591460421683> : You cant roll a die against a bot.").catch((err) => { })
            }
            if (!amount) return message.reply("<:error:946775591460421683> : Please specify the amount to bet on this roll.")
            if (isNaN(amount)) return message.reply("<:error:946775591460421683> : Please specify a valid amount to bet on this roll.")

            const userBal = await economy.getCoins(message.guild.id, message.author.id)
            const memberBal = await economy.getCoins(message.guild.id, opponent.user.id)

            if (amount > userBal) return message.reply(`<:error:946775591460421683> : You do not have enough ${tBucks} to bet on this roll.`)
            if (amount > memberBal) return message.reply(`<:error:946775591460421683> : The member you mentioned does not have enough ${tBucks} to bet on this roll.`)

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
                .setTitle("<a:dice_rolling:946769669329653800> Die Roll!")
                .setDescription(`${message.author.tag} has challenged ${opponent.user.tag} to a Die Roll!`)
                .setFooter({ text: `Die Roll requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
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

            function randomNumber(min, max) {
                return Math.round(Math.random() * (max - min) + min);
            }

            inviteCollector.on("collect", async (interaction) => {
                if (interaction.customId === "accept") {
                    const die1 = randomNumber(2, 12)
                    const die2 = randomNumber(2, 12)

                    if (die1 > die2) {
                        const winEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle(`${message.author.tag} has won the roll!`)
                            .addFields(
                                {
                                    name: `${message.author.tag} rolled:`,
                                    value: `🎲 ${die1}`,
                                    inline: true
                                },

                                {
                                    name: `${opponent.user.tag} rolled:`,
                                    value: `🎲 ${die2}`,
                                    inline: true
                                },
                                {
                                    name: `${message.author.tag} won:`,
                                    value: `<:Coins:946757996166389810> \`${amount * 2} ${tBucks}\``
                                },
                                {
                                    name: `${opponent.user.tag} lost:`,
                                    value: `<:Coins:946757996166389810> \`-${amount} ${tBucks}\``,
                                    inline: true
                                }
                            )
                            .setColor("#FFFF00")
                            .setTimestamp()

                        await inviterow.components[0].setDisabled(true)
                        await inviterow.components[1].setDisabled(true)
                        await inviteCollector.stop()
                        await economy.addCoins(message.guild.id, message.author.id, amount)
                        await economy.addCoins(message.guild.id, opponent.user.id, amount * -1)
                        await interaction.update({ embeds: [winEmbed], components: [inviterow] })
                    } else if (die2 > die1) {
                        const loseEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle(`${opponent.user.tag} has won the roll!`)
                            .addFields(
                                {
                                    name: `${message.author.tag} rolled:`,
                                    value: `🎲 ${die1}`,
                                    inline: true
                                },

                                {
                                    name: `${opponent.user.tag} rolled:`,
                                    value: `🎲 ${die2}`,
                                    inline: true
                                },
                                {
                                    name: `${message.author.tag} lost:`,
                                    value: `<:Coins:946757996166389810> \`-${amount} ${tBucks}\``
                                },
                                {
                                    name: `${opponent.user.tag} won:`,
                                    value: `<:Coins:946757996166389810> \`${amount * 2} ${tBucks}\``,
                                    inline: true
                                }
                            )
                            .setColor("#FFFF00")
                            .setTimestamp()

                        await inviterow.components[0].setDisabled(true)
                        await inviterow.components[1].setDisabled(true)
                        await inviteCollector.stop()
                        await economy.addCoins(message.guild.id, message.author.id, amount * -1)
                        await economy.addCoins(message.guild.id, opponent.user.id, amount)
                        await interaction.update({ embeds: [loseEmbed], components: [inviterow] })
                    } else if (die1 = die2) {
                        await inviteCollector.stop()
                        const tieEmbed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle(`It is a tie!`)
                            .addFields(
                                {
                                    name: `${message.author.tag} rolled:`,
                                    value: `🎲 ${die1}`,
                                    inline: true
                                },

                                {
                                    name: `${opponent.user.tag} rolled:`,
                                    value: `🎲 ${die2}`,
                                    inline: true
                                }
                            )
                            .setColor("#FFFF00")
                            .setTimestamp()

                        await inviterow.components[0].setDisabled(true)
                        await inviterow.components[1].setDisabled(true)
                        await interaction.update({ embeds: [tieEmbed], components: [inviterow] })
                    }
                } else {
                    const declineEmbed = new MessageEmbed()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setTitle("<a:dice_rolling:946769669329653800> Die Roll Declined!")
                        .setDescription(`${opponent.user.tag} has declined the Die Roll!`)
                        .setFooter({ text: `Die Roll requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setColor("#FFFF00")

                    await inviteCollector.stop()
                    await inviterow.components[0].setDisabled(true)
                    await inviterow.components[1].setDisabled(true)
                    interaction.update({ embeds: [declineEmbed], components: [inviterow] })
                }
            })

        })
    }
}