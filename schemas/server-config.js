const mongoose = require('mongoose')
const config = require("../config.json")

const reqString = {
  type: String,
  required: true,
}

const serverConfig = mongoose.Schema({
  guildId: reqString,
  coin: {
    type: String,
    default: config.coin
  },
  emote: {
    type: String,
    default: config.emote
  },
  prefix: {
    type: String,
    default: config.prefix
  },
  gamblingChannel: {
    type: String,
  },
  triviaChannel: {
    type: String,
  },
  shopLogs: {
    type: String,
  },
  triviaOn: {
    type: Boolean,
    default: false,
  },
  reqGuildId: {
    type: String,
  },
  gamesChannel: {
    type: String,
  },
  userChannel: {
    type: String,
  },
  rpsLimit: {
    type: String,
  },
  slotsLimit: {
    type: String,
  },
  horseLimit: {
    type: String,
  },
  daily: {
    type: String,
  },
  chatCoins: {
    type: String,
  },
  chatTimeout: {
    type: String,
  },
  blacklistChannels: {
    type: Array,
  },
  minvctime: {
    type: String,
  },
  minvccoins: {
    type: String,
  },
  pertimevctime: {
    type: String,
  },
  pertimevccoins: {
    type: String,
  },
  maxvctime: {
    type: String,
  },
})

module.exports = mongoose.model('server-config', serverConfig)
