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
  }
})

module.exports = mongoose.model('server-config', serverConfig)
