const { MessageEmbed } = require('discord.js');
const economy = require("../../utils/economy.js");
const serverConfig = require("../../schemas/server-config");
const config = require('../../config.json')

module.exports = {
    name: "addbal",
    aliases: ["addcoins", "addcredits", "addtBucks"],
    description: "Adds tBucks to the specified member's account",
    usage: "[member] [amount]",
    run: async (client, message, args) => {
    let tBucks;
    serverConfig.findOne({guildId: message.guild.id}, async (err, data) => {
        if (data) {
            tBucks = data.coin;
        } else {
            tBucks = config.coin;
        }
   
        const amount = parseInt(args[1]);
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("You do not have the \`ADMINISTRATOR\` permission to use this command!");
        if (!member) return message.reply("Please specify a valid member!");
        if (member.user.bot) return message.reply(`You cannot add ${tBucks} to a bot!`);
        if (!amount) return message.reply(`Please specify an amount of ${tBucks} to add to this user.`);
        if (isNaN(amount)) return message.reply(`Please specify a valid amount of ${tBucks} to add to this user.`);

        await economy.addCoins(member.user.id, amount)

        const embed = new MessageEmbed()
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(`${data.emote || config.emote} ${tBucks} Added!`)
            .setDescription(`${member.user.tag} has been given ${data.emote || config.emote}\`${amount} ${tBucks}\`!`)
            .setFooter({ text: `Powered by Limbo Labs` })
            .setTimestamp()
            .setColor("#FFFF00")

        message.reply({ embeds: [embed] });
    })
    }
}