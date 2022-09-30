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
            .setThumbnail("attachment://logo.png")
            .setTimestamp()
            .setFooter({ text: `Powered by Limbo Labs` })

        return message.reply({ embeds: [embed], files: ["./logo.png"] })
    }
}
