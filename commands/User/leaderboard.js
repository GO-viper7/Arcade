const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const profileSchema = require("../../schemas/profile-schema")
const economy = require('../../utils/economy')
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', 'top'],
    description: "Shows the richest members in the server.",
    run: async (client, message, args) => {
        let tBucks;
        serverConfig.findOne({ guildId: message.guild.id }, async (err, bruh) => {
            if (bruh) {
                tBucks = bruh.coin;
            } else {
                tBucks = config.coin;
            }
            if (!bruh.userChannel) return message.reply("Please set the user channel using the \`setuserchannel\` command.")
            if (message.channel.id !== bruh.userChannel) return message.reply(`Please run this command in the user channel. (${client.channels.cache.get(bruh.userChannel)})`)


            var users = await profileSchema.find({ guildId: message.guild.id }).sort([['OctaCreds', 'descending']]).exec()
            const data = users.slice(0, 10)
            if (!data[0]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[1]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[2]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[3]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[4]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[5]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[6]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[7]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[8]) return message.channel.send("There are no users on the leaderboard in this server yet!")
            if (!data[9]) return message.channel.send("There are no users on the leaderboard in this server yet!")

            const embed = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setTitle(`Top 10 Richest Members!`)
                .setColor("#FFFF00")
                .setThumbnail("attachment://logo.png")
                .addFields(
                    {
                        name: `1 | ${client.users.cache.get(data[0].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[0].OctaCreds}\` ${tBucks}`,
                    },
                    {
                        name: `2 | ${client.users.cache.get(data[1].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[1].OctaCreds}\` ${tBucks}`,
                    },
                    {
                        name: `3 | ${client.users.cache.get(data[2].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[2].OctaCreds}\` ${tBucks}`,
                    },
                    {
                        name: `4 | ${client.users.cache.get(data[3].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[3].OctaCreds}\` ${tBucks}`,
                    },
                    {
                        name: `5 | ${client.users.cache.get(data[4].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[4].OctaCreds}\` ${tBucks}`,
                    }
                )
                .setTimestamp()
                .setFooter({ text: "Powered by Limbo Labs" })

            const embed_2 = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setTitle(`Top 10 Richest Members!`)
                .setColor("#FFFF00")
                .setFooter({ text: "Powered by Limbo Labs" })
                .setTimestamp()
                .setThumbnail("attachment://logo.png")
                .addFields(
                    {
                        name: `6 | ${client.users.cache.get(data[5].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[5].OctaCreds}\` ${tBucks}`,
                    },
                    {
                        name: `7 | ${client.users.cache.get(data[6].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[6].OctaCreds}\` ${tBucks}`,
                    },
                    {
                        name: `8 | ${client.users.cache.get(data[7].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[7].OctaCreds}\` ${tBucks}`,
                    },
                    {
                        name: `9 | ${client.users.cache.get(data[8].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[8].OctaCreds}\` ${tBucks}`,
                    },
                    {
                        name: `10 | ${client.users.cache.get(data[9].userId).tag}`,
                        value: `${data.emote || config.emote} \`${data[9].OctaCreds}\` ${tBucks}`,
                    }
                )

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setEmoji("⬅")
                    .setCustomId("back")
                    .setStyle("PRIMARY"),

                new MessageButton()
                    .setEmoji("➡")
                    .setCustomId("forward")
                    .setStyle("PRIMARY")
            )


            const initial = await message.reply({ embeds: [embed], components: [row], files: ["./logo.png"] })

            const filter = (interaction) => {
                if (interaction.user.id === message.author.id) return true;
                return interaction.reply({
                    content: `Only ${message.author.tag} can use this interaction!`,
                    ephemeral: true,
                });
            };

            const collector = initial.createMessageComponentCollector({
                filter,
                componentType: "BUTTON",
                time: 60000,
            })

            collector.on("collect", async (interaction) => {
                if (interaction.customId === "back") {
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(false)
                    interaction.update({ embeds: [embed], components: [row], files: ["./logo.png"] })
                } else if (interaction.customId === "forward") {
                    row.components[1].setDisabled(true)
                    row.components[0].setDisabled(false)
                    interaction.update({ embeds: [embed_2], components: [row], files: ["./logo.png"] })
                }
            })
        })
    },
}