const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const isPlaying = new Set()
const economy = require("./utils/economy.js");
const serverConfig = require("./schemas/server-config");
const config = require('../config.json')

module.exports = {
    name: "trivia",
    description: "Gives a Random Trivia question.",
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
                return message.reply("There is already a Guess-The-Logo game running in this channel. Type \`stop\` to stop the existing game")
            } else {
                isPlaying.add(message.channel.id)
                fetch(`https://opentdb.com/api.php?amount=1&type=multiple`)
                    .then(res => res.json())
                    .then(data => {
                        const a = data.results[0].correct_answer.replace(/(&quot\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\&")
                        const b = data.results[0].incorrect_answers[0].replace(/(&quot\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\&")
                        const c = data.results[0].incorrect_answers[1].replace(/(&quot\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\&")
                        const d = data.results[0].incorrect_answers[2].replace(/(&quot\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\&")

                        const array = [a, b, c, d]
                        function shuffle(array) {
                            let currentIndex = array.length, randomIndex;

                            // While there remain elements to shuffle...
                            while (currentIndex != 0) {

                                // Pick a remaining element...
                                randomIndex = Math.floor(Math.random() * currentIndex);
                                currentIndex--;

                                // And swap it with the current element.
                                [array[currentIndex], array[randomIndex]] = [
                                    array[randomIndex], array[currentIndex]];
                            }

                            return array;
                        }

                        shuffle(array);


                        const embed = new MessageEmbed()
                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setTitle(`Trivia!`)
                            .addFields(
                                {
                                    name: `Category`,
                                    value: `${data.results[0].category}`,
                                    inline: true
                                },
                                {
                                    name: `Instructions`,
                                    value: `Type the correct answer!`,
                                    inline: true
                                },
                                {
                                    name: `${data.results[0].question.replace(/(&quot\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\&")}`,
                                    value: `A) ${array[0]}\nB) ${array[1]}\nC) ${array[2]}\nD) ${array[3]}`
                                }
                            )
                            .setColor("FFFF00")
                            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                        let maxAttempts = 30;
                        const amount = Math.floor((Math.random() * 100) + 50)

                        message.channel.send({ embeds: [embed] })
                        const gameCollector = message.channel.createMessageCollector();
                        let i = maxAttempts - 1;
                        gameCollector.on('collect', async msg => {
                            if (msg.author.bot) return
                            const selection = msg.content.toLowerCase();
                            if (selection === a.toLowerCase()) {
                                message.channel.send({ content: `${msg.author} got it right! Their account has been deposited with  <:Coins:946757996166389810> \`${amount}\` ${tBucks}!` })
                                gameCollector.stop()
                                economy.addCoins(message.guild.id, msg.author.id, amount)
                                isPlaying.delete(message.channel.id)
                            } else if (selection === "stop") {
                                message.channel.send(`The correct answer was ${a}`)
                                gameCollector.stop();
                                isPlaying.delete(message.channel.id)
                            } else if (i <= maxAttempts && selection !== a.toLowerCase() && selection !== "stop" && i > 0) {
                                i--;
                                message.channel.send(`:x: | You have ${i + 1} chances left | Type \`stop\` to cancel the Game`)
                            } else if (i <= 0 && selection !== a.toLowerCase()) {
                                message.channel.send(`No one guessed it! The correct answer was ${a}`)
                                isPlaying.delete(message.channel.id)
                                gameCollector.stop();
                            }
                        })
                    })
            }
        })
    }
}