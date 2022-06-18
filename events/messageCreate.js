const { Collection } = require("discord.js")
const client = require("../index");
const ms = require("ms")
const Timeout = new Collection()
const serverConfig = require("../schemas/server-config");

client.on("messageCreate", async (message) => {

  let prefix = client.config.prefix


  serverConfig.findOne({ guildId: message.guildId }, async (err, data) => {
    if (data) {
      if (data.prefix) {
        prefix = data.prefix

        if (message.content.toLowerCase().startsWith("?prefix")) return message.reply(`My prefix in this server is: \`${prefix}\``)

        if (
          message.author.bot ||
          !message.guild ||
          !message.content.toLowerCase().startsWith(prefix)
        )
          return;




        const [cmd, ...args] = message.content
          .slice(client.config.prefix.length)
          .trim()
          .split(" ");

        let command = client.commands.get(cmd.toLowerCase());

        if (!command) command = client.commands.get(client.aliases.get(cmd.toLowerCase()))
        if (command) {
          if (command.timeout) {
            if (Timeout.has(`${command.name}${message.author.id}`)) return message.channel.send(`You are on a \`${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}\` cooldown.`)
            command.run(client, message, args)
            Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
            setTimeout(() => {
              Timeout.delete(`${command.name}${message.author.id}`)
            }, command.timeout)
          } else {
            command.run(client, message, args)
          }
        }
      } else {
        prefix = client.config.prefix

        if (message.content.toLowerCase().startsWith("?prefix")) return message.reply(`My prefix in this server is: \`${prefix}\``)

        if (
          message.author.bot ||
          !message.guild ||
          !message.content.toLowerCase().startsWith(prefix)
        )
          return;

        const [cmd, ...args] = message.content
          .slice(client.config.prefix.length)
          .trim()
          .split(" ");

        let command = client.commands.get(cmd.toLowerCase());

        if (!command) command = client.commands.get(client.aliases.get(cmd.toLowerCase()))
        if (command) {
          if (command.timeout) {
            if (Timeout.has(`${command.name}${message.author.id}`)) return message.channel.send(`You are on a \`${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}\` cooldown.`)
            command.run(client, message, args)
            Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
            setTimeout(() => {
              Timeout.delete(`${command.name}${message.author.id}`)
            }, command.timeout)
          } else {
            command.run(client, message, args)
          }
        }
      }
    } else {
      prefix = client.config.prefix

      if (message.content.toLowerCase().startsWith("?prefix")) return message.reply(`My prefix in this server is: \`${prefix}\``)

      if (
        message.author.bot ||
        !message.guild ||
        !message.content.toLowerCase().startsWith(prefix)
      )
        return;

      const [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(" ");

      let command = client.commands.get(cmd.toLowerCase());

      if (!command) command = client.commands.get(client.aliases.get(cmd.toLowerCase()))
      if (command) {
        if (command.timeout) {
          if (Timeout.has(`${command.name}${message.author.id}`)) return message.channel.send(`You are on a \`${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}\` cooldown.`)
          command.run(client, message, args)
          Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.timeout)
          setTimeout(() => {
            Timeout.delete(`${command.name}${message.author.id}`)
          }, command.timeout)
        } else {
          command.run(client, message, args)
        }
      }
    }
  })
});