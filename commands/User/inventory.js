const Discord = require('discord.js')
const inventory = require('../../schemas/inv-schema')
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: 'inventory',
    aliases: ["inv"],
    description: "Checks your inventory.",
    timeout: 5,
    run: async (client, message, args) => {
 
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (!data.userChannel) return message.reply("Please set the user channel using the \`setuserchannel\` command.")
            if (message.channel.id !== data.userChannel) return message.reply(`Please run this command in the user channel. (${client.channels.cache.get(data.userChannel)})`)

            const member = message.mentions.users.first() || message.author
            const { guild } = message
            inventory.findOne(
                { guildId: guild.id, userId: member.id },
                async (err, data) => {
                    if (!data) return message.reply(`**Your inventory is empty!**`)
                    const mappedData = Object.keys(data.Inventory)
                        .map((key) => {
                            return { name: `<:purpleArrow:946751539341574174>${key}(s)`, value: `>>> ${data.Inventory[key]}` };
                        })


                    message.reply(
                        {
                            embeds: [new Discord.MessageEmbed()
                                .setTitle(`🛍️ ${member.tag}'s Inventory!`)
                                .addFields(...mappedData)
                                .setColor("FFFF00")
                                .setThumbnail("https://cdn.discordapp.com/attachments/945844991744426014/946344182895767603/IMG_4665.gif")]
                        }
                    )
                }
            )
        })
    },
}