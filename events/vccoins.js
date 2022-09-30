const { Collection, Message } = require("discord.js");
const client = require("../index");
const serverConfig = require("../schemas/server-config");
const joined = new Collection
const economy = require("../utils/economy")

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.channel === null) {
        // console.log('user left channel', oldState.channel.name);
        serverConfig.findOne({ guildId: oldState.guild.id }, async (err, data) => {
            if (oldState.member.user.bot) return
            const joinTime = await joined.get(oldState.member.id)
            const timeinvc = (Date.now() - joinTime)
            if (timeinvc < data.minvctime) {
                console.log("Man didn't spend enough time in vc lol.")
                joined.delete(oldState.member.id)
            }
            if (timeinvc >= data.minvctime) {
                if (timeinvc > data.maxvctime) {
                    const lmao = Math.round((data.maxvctime - data.minvctime) / data.pertimevctime)
                    const coinstobeadded = Math.round(parseInt(data.minvccoins) + parseInt(lmao * data.pertimevccoins))
                    console.log(coinstobeadded)
                    joined.delete(oldState.member.id)
                    await economy.addCoins(oldState.guild.id, oldState.member.id, coinstobeadded)
                } else {
                    const lmao = (timeinvc - data.minvctime) / (data.pertimevctime)
                    if (lmao < 1) {
                        await economy.addCoins(oldState.guild.id, oldState.member.id, data.minvccoins)
                        joined.delete(oldState.member.id)
                    } else if (lmao >= 1) {
                        const lol = Math.round(lmao)
                        const coinstobeadded = Math.round(parseInt(data.minvccoins) + parseInt(data.pertimevccoins * lol))
                        console.log(coinstobeadded)
                        joined.delete(oldState.member.id)
                        await economy.addCoins(oldState.guild.id, oldState.member.id, coinstobeadded)
                    }
                }
            }
        })
    }
    else if (oldState.channel === null) {
        //console.log('user joined channel', newState.channel.name);
        if (newState.member.user.bot) return
        await joined.set(newState.member.id, Date.now())
    }
    else {
        console.log('user moved channels', oldState.channel.name, newState.channel.name)
    };
});
