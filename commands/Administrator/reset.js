const profileSchema = require('../../schemas/profile-schema.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

module.exports = {
    name: "reset",
    description: "Resets the whole server's economy leaderboard (affects only in-game currency; items will be left untouched).",
    run: async (client, message, args) => {
 
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("You don't have the \`ADMINISTRATOR\` permission to use this command!")

        await profileSchema.deleteMany({ guildId: message.guild.id })

        const embed = new MessageEmbed()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
            .setTitle("Economy Leaderboard Reset!")
            .setDescription("All players' in-game currency has been reset.")
            .setColor("#FFFF00")
            .setThumbnail("https://cdn.discordapp.com/attachments/945844991744426014/946344061231579176/IMG_0097.gif")
            .setTimestamp()
            .setFooter({ text: `Resetted by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

        return message.reply({ embeds: [embed] })
    }
}
