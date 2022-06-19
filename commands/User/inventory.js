const Discord = require('discord.js')
const inventory = require('../../schemas/item-schema')
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
            inventory.find(
                { userId: member.id },
                async (err, data) => {
                    if (data.length == 0) return message.reply(`**Your inventory is empty!**`)
                    var x = ''
                    data.forEach(k=> {
                       x+=`**Name:** ${k.name}\n**Category:** ${k.category}\n\n`
                    })


                    message.reply(
                        {
                            embeds: [new Discord.MessageEmbed()
                                .setTitle(`🛍️ ${member.tag}'s Inventory!`)
                                .setDescription(x)
                                .setColor("FFFF00")
                                .setThumbnail("https://cdn.discordapp.com/attachments/985965538217984022/985986145269719060/Orange.png")]
                        }
                    )
                }
            )
        })
    },
}