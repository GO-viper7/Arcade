const Discord = require("discord.js");

module.exports = {
  name: "act",
  aliases: ["aliase"],
  description: "description",
  category: "category",
  guildOnly: true,
  memberpermissions:"VIEW_CHANNEL",
  cooldown: 2,
  usage: "<usage>",
  run: async(client, message, args) => {
    let k='';
    const member = message.mentions.members.first() || message.member
    console.log(member)
    member.presence.activities.forEach((x) => {
       k+=`** • Name  :** ${x.name} \n   **Play Time : **${Math.floor((Date.now() - x.createdTimestamp)/60000)} Minutes\n\n`;
    })
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Track of ${member.user.username}'s Activity`)
      .setDescription(`**Number of Current Activities :** ${member.presence.activities.length}\n\n${k}`)
    return message.reply({embeds: [embed]})
  }
};