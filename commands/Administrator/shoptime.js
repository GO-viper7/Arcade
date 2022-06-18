const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const shopSchema = require("../../schemas/shop-schema.js")
const economy = require("../../utils/economy.js")
const inventory = require("../../schemas/inv-schema")
const serverConfig = require("../../schemas/server-config")
const ms = require("ms");
const config = require('../../config.json')

module.exports = {
    name: "shoptime",
    aliases: ["timeshop"],
    description: "Opens the shop in the provided channel after specified time.",
    usage: "<channel> <time> <item> <number of items>",
    run: async (client, message, args) => {
        let tBucks;
    serverConfig.findOne({guildId: message.guild.id}, async (err, data) => {
        if (data) {
            tBucks = data.coin;
        } else {
            tBucks = config.coin;
        }
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("You don't have the \`ADMINISTRATOR\` permission to use this command!")

        if (!args[0]) return message.reply("<:error:946775591460421683> : Please specify the channel you want to open the shop in!")
        const channel = message.mentions.channels.first() || message.guilds.channels.cache.get(`${args[0]}`) || message.guild.channels.cache.find(c => c.name === args[1])
        if (!channel) return message.reply("Couldn't find the channel!")
        if (!args[1]) return message.reply("<:error:946775591460421683> : Please specify the time after which you want to open the shop!\n\nExample: `1h`")
        if (!ms(args[1])) return message.reply("<:error:946775591460421683> : Please specify a valid time after which you want to open the shop!\n\nExample: `1h`")
        if (!args[2]) return message.reply("<:error:946775591460421683> : Please specify the item you want to sell!")

        shopSchema.findOne({ guildId: message.guild.id, item: args[2].toLowerCase() }, async (err, data) => {
            if (err) console.log(err)
            if (!data) return message.reply("<:error:946775591460421683> : That item doesn't exist!")
            if (!args[3]) return message.reply("<:error:946775591460421683> : Please specify the number of items you want to sell!")
            if (isNaN(args[3])) return message.reply("<:error:946775591460421683> : Please specify a valid number of items you want to sell!")

            await message.react("✅")
            data.amount = args[3]
            await data.save().catch(err => console.log(err))

            const embed = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setTitle("Shop Opened!")
                .addFields(
                    {
                        name: "🛍️ Item",
                        value: `\`${data.item}\``,
                    },
                    {
                        name: "<:Coins:946757996166389810> Price",
                        value: `\`${data.price} ${tBucks}\``,
                    },
                    {
                        name: "🎯 Number of items",
                        value: `\`${args[3]}\``,
                    }
                )
                .setColor("#FFFF00")
                .setThumbnail("https://cdn.discordapp.com/attachments/945844991744426014/946344061000876082/IMG_5521.webp")
                .setTimestamp()
                .setFooter({ text: `Shop opened by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("Buy Now!")
                    .setStyle("PRIMARY")
                    .setCustomId("buy")
                    .setEmoji("🛒")
            )

            setTimeout(async () => {
                const initial = await channel.send({ embeds: [embed], components: [row] })

                const collector = initial.createMessageComponentCollector({
                    componentType: "BUTTON",
                })
                const alreadyPressed = []

                collector.on('collect', async (interaction) => {
                    if (data.amount <= 0) {
                        collector.stop()
                    }
                    if (!!alreadyPressed.find(id => {
                        return id.ID === interaction.user.id + interaction.message.id
                    })) {
                        interaction.reply({ content: `You've already bought/attempted to buy this item!`, ephemeral: true })
                    } else {
                        const bal = await economy.getCoins(message.guild.id, interaction.user.id)
                        const itemPrice = data.price
                        if (bal < itemPrice) return interaction.reply({ content: `You don't have enough ${tBucks} to buy this item!`, ephemeral: true })
                        inventory.findOne({ guildId: message.guild.id, userId: interaction.user.id }, async (err, bruh) => {
                            if (bruh) {
                                const hasItem = Object.keys(bruh.Inventory).includes(data.item)
                                if (!hasItem) {
                                    bruh.Inventory[data.item] = 1
                                } else {
                                    bruh.Inventory[data.item]++
                                }
                                await inventory.findOneAndUpdate({ guildId: message.guild.id, userId: interaction.user.id }, bruh)
                            } else {
                                new inventory({
                                    guildId: message.guild.id,
                                    userId: interaction.user.id,
                                    Inventory: {
                                        [data.item]: 1,
                                    },
                                }).save()
                            }
                            data.amount--
                            await data.save()
                            await economy.addCoins(message.guild.id, interaction.user.id, -1 * itemPrice)
                            interaction.reply({ content: `You have successfully bought ${data.item}!`, ephemeral: true })

                            const logEmbed = new MessageEmbed()
                                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                                .setTitle("Item Bought!")
                                .addFields(
                                    {
                                        name: "👤 User",
                                        value: `\`${interaction.user.tag}\``,
                                    },
                                    {
                                        name: "🛒 Item",
                                        value: `\`${data.item}\``,
                                    },
                                    {
                                        name: "<:Coins:946757996166389810> Price",
                                        value: `\`${itemPrice} ${tBucks}\``,
                                    }
                                )
                                .setColor("#FFFF00")
                                .setTimestamp()
                                .setThumbnail("https://cdn.discordapp.com/attachments/945844991744426014/946344061000876082/IMG_5521.webp")

                            serverConfig.findOne({ guildId: message.guild.id }, async (err, config) => {
                                if (config.shopLogs) {
                                    const logChannel = message.guild.channels.cache.get(`${config.shopLogs}`)
                                    if (logChannel) {
                                        await logChannel.send({ embeds: [logEmbed] })
                                    }
                                }
                            })
                        })
                        alreadyPressed.push({ ID: interaction.user.id + interaction.message.id })
                    }
                })

                collector.on('end', () => {
                    row.components[0].setDisabled(true)
                    initial.edit({ components: [row], content: `All the items have been sold and the shop has been closed!` })
                    delete alreadyPressed
                })
            }, ms(args[1]))
        })
    })
    }
}