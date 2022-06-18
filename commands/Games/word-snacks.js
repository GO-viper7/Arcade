const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const fetch = require('node-fetch')
const serverConfig = require("../../schemas/server-config")


module.exports = {
    name: "word-snacks",
    aliases: ["wordsnacks"],
    description: "Starts a new Word Snacks game activity in a voice channel.",

    run: async (client, message, args) => {
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (!data.gamesChannel) return message.reply("Please set the gambling channel using \`setgameschannel\` command.")
            if (data.gamesChannel !== message.channel.id) return message.reply(`Please run this command in the gaming channel. (${client.channels.cache.get(data.gamesChannel)})`)

            const { guild } = message

            let channel = message.member.voice.channel;
            if (!channel) {
                try {
                    return await message.reply(":<:error:946775591460421683> : You have to be in a Voice Channel to use this command.")
                } catch (e) {
                    console.log(e)
                }
            }

            fetch(`https://discord.com/api/v9/channels/${channel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "879863976006127627",
                    target_type: 2,
                    temporary: false,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${client.token}`,
                    "Content-Type": "application/json"
                }
            })

                .then(res => res.json())
                .then(async (invite) => {
                    if (!invite.code) {
                        try {
                            return await message.reply("Sadly I was unable to start a Word Snacks activity.")
                        } catch (e) {
                            console.log(e)
                        }
                    }

                    try {
                        const e = new MessageEmbed()
                            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
                            .setTitle(`Word Snacks!`)
                            .setDescription(`**Click the button below to play Word Snacks!**`)
                            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                            .setTimestamp()
                            .setColor('FFFF00')

                        const row = new MessageActionRow().addComponents(
                            new MessageButton()
                                .setStyle("LINK")
                                .setLabel('Click to play!')
                                .setURL(`https://discord.com/invite/${invite.code}`)
                        )

                        message.reply({
                            components: [row],
                            embeds: [e]
                        })
                    } catch (e) {
                        console.log(e)
                    }
                })
        })
    }
}