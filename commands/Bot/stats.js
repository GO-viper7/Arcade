const { MessageEmbed } = require("discord.js")
const os = require('os-utils')
const osu = require("os")

module.exports = {
    name: "botinfo",
    aliases: ["about", "stats"],
    description: "Shows statistics and information about the bot.",
    run: async (client, message, args) => {

        const octagone = client.users.cache.get("717166815943327764")
        const saizuo = client.users.cache.get("532177714203852800")

        os.cpuUsage(function (v) {
            const L = v
            const embed = new MessageEmbed()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTitle("About me!")
                .setThumbnail(client.user.displayAvatarURL())
                .setColor("000001")
                .addFields(
                    {
                        name: "Discord Stats",
                        value: `- Servers: \`${client.guilds.cache.size}\`\n- Users: \`${client.users.cache.size}\``
                    },
                    {
                        name: "Hardware Stats",
                        value: `- CPU Usage: \`${L.toFixed(2)}%\`\n- CPU Cores: \`${os.cpuCount()}\`\n- Total Memory: \`512 MB\`\n- Current memory in use: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\n- Platform: \`${os.platform()}\``
                    }
                )
                .setFooter({ text: `Powered by Limbo Labs` })

            message.reply({ embeds: [embed] })
        });


    }
}