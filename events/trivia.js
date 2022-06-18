const serverConfig = require("../schemas/server-config")
const economy = require("../utils/economy")
const { MessageEmbed } = require("discord.js")
const client = require("..")
const guildId = "907724667865944086"
const fetch = require("node-fetch")
const isAnswered = new Set()
const config = require('../config.json')

client.on("ready", async () => {
    setInterval(async () => {
        let tBucks;
        await serverConfig.findOne({ guildId }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            if (!data) return
            if (data.triviaOn === false) return
            const channel = client.channels.cache.get(data.triviaChannel)
            if (!channel) return

            fetch(`https://opentdb.com/api.php?amount=1&type=multiple`)
                .then(res => res.json())
                .then(async (data) => {
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

                    let maxAttempts = 30;
                    const amount = 200

                    const initial = channel.send({ embeds: [embed] })
                    await isAnswered.add(initial.id)
                    const gameCollector = channel.createMessageCollector({ time: 55000 });
                    let i = maxAttempts - 1;
                    gameCollector.on('collect', async msg => {
                        if (msg.author.bot) return
                        const selection = msg.content.toLowerCase();
                        if (selection === a.toLowerCase()) {
                            channel.send({ content: `${msg.author} got it right! Their account has been deposited with  <:Coins:946757996166389810> \`${amount}\` ${tBucks}!` })
                            await isAnswered.delete(initial.id)
                            gameCollector.stop()
                            economy.addCoins(guildId, msg.author.id, amount)
                        } else if (i <= maxAttempts && selection !== a.toLowerCase() && selection !== "stop" && i > 0) {
                            i--;
                        } else if (i <= 0 && selection !== a.toLowerCase()) {
                            await isAnswered.delete(initial.id)
                            channel.send(`No one guessed it! The correct answer was ${a}`)
                            gameCollector.stop();
                        }
                    })
                    gameCollector.on("end", async () => {
                        if (isAnswered.has(initial.id)) {
                            await isAnswered.delete(initial.id)
                            channel.send(`The time ran out and no one guessed it correctly! The correct answer was ${a}`)
                        }
                    })
                })
        }).clone()
    }, 60000)
})