const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const isPlaying = new Set()
const economy = require("../../utils/economy.js");
const serverConfig = require("../../schemas/server-config");
const config = require('../../config.json')

module.exports = {
    name: "guessthepokemon",
    aliases: ["gtp", "whichpokemon", "whopokemon", "pokemon"],
    description: "Gives a Guess-The-Pokemon question.",
    run: async (client, message, args) => {
        let tBucks;
        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            if (!data.triviaChannel) return message.reply("Please set the trivia channel using the \`settriviachannel\` command.")
            if (message.channel.id !== data.triviaChannel) return message.reply(`Please run this command in the trivia channel. (${client.channels.cache.get(data.triviaChannel)})`)
            if (isPlaying.has(message.channel.id)) {
                return message.reply("There is already a Guess-The-Pokemon game running in this channel. Type \`stop\` to stop the existing game")
            } else {
                isPlaying.add(message.channel.id)

                fetch(`https://api.dagpi.xyz/data/wtp`, {
                    headers: {
                        "Authorization": client.config.dagpi
                    }
                })
                    .then(res => res.json())
                    .then(data => {

                        const pok = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle(`Who's That Pokemon?`)
                            .setDescription("Type the name of the pokemon you think is in the picture!\n\nYou have 3 chances to guess the pokemon! Type \`stop\` to stop the game.")
                            .addField(`Type:`, `${data.Data.Type}`, true)
                            .addField(`Abilities:`, `${data.Data.abilities}`, true)
                            .setImage(data.question)
                            .setColor("FFFF00")
                            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                        const right = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("You guessed it right!")
                            .setAuthor(message.author.tag)
                            .setURL(data.Data.Link)
                            .setDescription(`It was ${data.Data.name}!`)
                            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setColor("FFFF00")
                            .setImage(data.answer)


                        const wrong = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle("You guessed it wrong!")
                            .setAuthor(message.author.tag)
                            .setURL(data.Data.Link)
                            .setDescription(`It was ${data.Data.name}`)
                            .setColor("FFFF00")
                            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setImage(data.answer)

                        let maxAttempts = 10;
                        const amount = randomNumber(10, 20)
                        function randomNumber(min, max) {
                            return Math.round(Math.random() * (max - min) + min);
                        }

                        message.channel.send({ embeds: [pok] })
                        const gameCollector = message.channel.createMessageCollector();
                        let i = maxAttempts - 1;
                        gameCollector.on('collect', async msg => {
                            if (msg.author.bot) return
                            const selection = msg.content.toLowerCase();
                            if (selection === data.Data.name.toLowerCase()) {
                                message.channel.send({ embeds: [right], content: `${msg.author}'s account has been deposited with ${amount} ${tBucks}!` })
                                gameCollector.stop()
                                economy.addCoins(message.guild.id, msg.author.id, amount)
                                isPlaying.delete(message.channel.id)
                            } else if (selection === "stop") {
                                message.channel.send({ embeds: [wrong] })
                                gameCollector.stop();
                                isPlaying.delete(message.channel.id)
                            } else if (i <= maxAttempts && selection !== data.Data.name && selection !== "stop" && i > 0) {
                                i--;
                                message.channel.send(`:x: | You have ${i + 1} chances left | Type \`stop\` to cancel the Game`)
                            } else if (i <= 0 && selection !== data.brand) {
                                message.channel.send({ embeds: [wrong] })
                                isPlaying.delete(message.channel.id)
                                gameCollector.stop();
                            }
                        })

                    })
            }
        })
    }
}