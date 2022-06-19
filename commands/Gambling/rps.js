const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const economy = require("../../utils/economy")
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: 'rps',
    aliases: ['rockpaperscissors', 'rockpaperscissorsgame'],
    usage: '<amount>',
    description: 'Starts a game of Rock Paper Scissors with the bot.',
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

            if (!args[0]) return message.channel.send(`You need to specify an amount of ${tBucks} to gamble!`)
            if (isNaN(args[0])) return message.channel.send(`You need to specify a valid amount of ${tBucks} to gamble!`)
            if (args[0] < 1) return message.channel.send(`You need to specify an amount of ${tBucks} to gamble!`)
            const userBal = await economy.getCoins(message.guild.id, message.author.id)

            if (args[0] > userBal) return message.channel.send(`You don't have enough ${tBucks} to gamble!`)

            const embed = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle("Rock Paper Scissors!")
                .setDescription("Click on any one of the options below!")
                .setColor("FFFF00")
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            const row = new MessageActionRow().addComponents(
                rock = new MessageButton()
                    .setStyle("DANGER")
                    .setLabel("Rock")
                    .setEmoji("🪨")
                    .setCustomId("rock"),

                paper = new MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Paper")
                    .setEmoji("📄")
                    .setCustomId("paper"),

                scissors = new MessageButton()
                    .setStyle("PRIMARY")
                    .setLabel("Scissors")
                    .setEmoji("✂️")
                    .setCustomId("scissors")
            )

            const initialMessage = await message.reply({ embeds: [embed], components: [row] })

            const filter = (interaction) => {
                if (interaction.user.id === message.author.id) return true;
                return interaction.reply({
                    content: `Only ${message.author.tag} can use this interaction!`,
                    ephemeral: true,
                });
            };

            const collector = initialMessage.createMessageComponentCollector({
                filter,
                componentType: "BUTTON",
                time: 60000
            })

            collector.on("collect", async (interaction) => {
                const userChoice = interaction.customId
                const choices = ["rock", "paper", "scissors"]
                const botChoice = choices[Math.floor(Math.random() * 3)]

                if (userChoice === "rock" && botChoice === "rock") {

                    embed.setDescription("It's a tie!")
                    row.components[0].setDisabled(true).setStyle("PRIMARY")
                    row.components[1].setDisabled(true).setStyle("SECONDARY")
                    row.components[2].setDisabled(true).setStyle("SECONDARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })
                }

                if (userChoice === "paper" && botChoice === "paper") {

                    embed.setDescription("It's a tie!")
                    row.components[0].setDisabled(true).setStyle("SECONDARY")
                    row.components[1].setDisabled(true).setStyle("PRIMARY")
                    row.components[2].setDisabled(true).setStyle("SECONDARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })
                }

                if (userChoice === "scissors" && botChoice === "scissors") {

                    embed.setDescription("It's a tie!")
                    row.components[0].setDisabled(true).setStyle("SECONDARY")
                    row.components[1].setDisabled(true).setStyle("SECONDARY")
                    row.components[2].setDisabled(true).setStyle("PRIMARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })
                }

                if (userChoice === "rock" && botChoice === "scissors") {
                    await economy.addCoins(message.guild.id, message.author.id, args[0])
                    embed.setDescription(`${message.author.tag} won! I chose scissors!\n\nAmount won: ${data.emote || config.emote}\`${args[0]} ${tBucks}\``)
                    row.components[0].setDisabled(true).setStyle("PRIMARY")
                    row.components[1].setDisabled(true).setStyle("SECONDARY")
                    row.components[2].setDisabled(true).setStyle("SECONDARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })
                }

                if (userChoice === "paper" && botChoice === "rock") {
                    await economy.addCoins(message.guild.id, message.author.id, args[0])
                    embed.setDescription(`${message.author.tag} won! I chose rock!\n\nAmount won: ${data.emote || config.emote}\`${args[0]} ${tBucks}\``)
                    row.components[0].setDisabled(true).setStyle("SECONDARY")
                    row.components[1].setDisabled(true).setStyle("PRIMARY")
                    row.components[2].setDisabled(true).setStyle("SECONDARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })
                }

                if (userChoice === "scissors" && botChoice === "paper") {
                    await economy.addCoins(message.guild.id, message.author.id, args[0])
                    embed.setDescription(`${message.author.tag} won! I chose paper!\n\nAmount won: ${data.emote || config.emote}\`${args[0]} ${tBucks}\``)
                    row.components[0].setDisabled(true).setStyle("SECONDARY")
                    row.components[1].setDisabled(true).setStyle("SECONDARY")
                    row.components[2].setDisabled(true).setStyle("PRIMARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })
                }

                if (userChoice === "rock" && botChoice === "paper") {

                    await economy.addCoins(message.guild.id, message.author.id, args[0] * -1)
                    embed.setDescription(`${message.author.tag} lost! I chose paper!\n\nAmount lost: ${data.emote || config.emote}\`-${args[0]} ${tBucks}\``)
                    row.components[0].setDisabled(true).setStyle("PRIMARY")
                    row.components[1].setDisabled(true).setStyle("SECONDARY")
                    row.components[2].setDisabled(true).setStyle("SECONDARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })

                }

                if (userChoice === "paper" && botChoice === "scissors") {

                    await economy.addCoins(message.guild.id, message.author.id, args[0] * -1)
                    embed.setDescription(`${message.author.tag} lost! I chose scissors!\n\nAmount lost: ${data.emote || config.emote}\`-${args[0]} ${tBucks}\``)
                    row.components[0].setDisabled(true).setStyle("SECONDARY")
                    row.components[1].setDisabled(true).setStyle("PRIMARY")
                    row.components[2].setDisabled(true).setStyle("SECONDARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })
                }

                if (userChoice === "scissors" && botChoice === "rock") {

                    await economy.addCoins(message.guild.id, message.author.id, args[0] * -1)
                    embed.setDescription(`${message.author.tag} lost! I chose rock!\n\nAmount lost: ${data.emote || config.emote}\`-${args[0]} ${tBucks}\``)
                    row.components[0].setDisabled(true).setStyle("SECONDARY")
                    row.components[1].setDisabled(true).setStyle("SECONDARY")
                    row.components[2].setDisabled(true).setStyle("PRIMARY")
                    collector.stop()
                    return interaction.update({ embeds: [embed], components: [row] })
                }
            })
        })
    }
}