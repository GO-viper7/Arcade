const shopSchema = require("../../schemas/shop-schema.js")
const { MessageEmbed } = require("discord.js")
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "additem",
    description: "Adds an item to the shop",
    usage: "[item] [price]",
    run: async (client, message, args) => {
        let tBucks;
    serverConfig.findOne({guildId: message.guild.id}, async (err, data) => {
        if (data) {
            tBucks = data.coin;
        } else {
            tBucks = config.coin;
        }
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("You don't have the \`ADMINISTRATOR\` permission to use this command!")
        if (!args[0]) return message.reply("<:error:946775591460421683> : Please specify the item you want to add!")
        if (!args[1]) return message.reply("<:error:946775591460421683> : Please specify the price of the item!")

        const item = args[0].toLowerCase()
        const price = parseInt(args[1])

        if (isNaN(price)) return message.reply("<:error:946775591460421683> : Please specify a valid price!")

        shopSchema.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (err) console.log(err)
            if (!data) {
                const newShop = new shopSchema({
                    guildId: message.guild.id,
                    item: item,
                    price: price
                })
                await newShop.save().catch(err => console.log(err))

                const embed = new MessageEmbed()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                    .setTitle("Item Added!")
                    .addFields(
                        {
                            name: "🛍️ Item",
                            value: `\`${item}\``,
                        },
                        {
                            name: "<:Coins:946757996166389810> Price",
                            value: `\`${price} ${tBucks}\``,
                        }
                    )
                    .setColor("#FFFF00")
                    .setThumbnail("https://cdn.discordapp.com/attachments/945844991744426014/946344061231579176/IMG_0097.gif")
                    .setTimestamp()
                    .setFooter({ text: `Item added by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                return message.reply({ embeds: [embed] })
            } else {
                const newShop = new shopSchema({
                    guildId: message.guild.id,
                    item: item,
                    price: price
                })
                await newShop.save().catch(err => console.log(err))

                const embed = new MessageEmbed()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                    .setTitle("Item Added!")
                    .addFields(
                        {
                            name: "🛍️ Item",
                            value: `\`${item}\``,
                        },
                        {
                            name: "<:Coins:946757996166389810> Price",
                            value: `\`${price} ${tBucks}\``,
                        }
                    )
                    .setColor("#FFFF00")
                    .setThumbnail("https://cdn.discordapp.com/attachments/945844991744426014/946344061231579176/IMG_0097.gif")
                    .setTimestamp()
                    .setFooter({ text: `Item added by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                return message.reply({ embeds: [embed] })
            }
        })
    })
    }
}