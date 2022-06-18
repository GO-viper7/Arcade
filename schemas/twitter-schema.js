const mongoose = require('mongoose')


const twitterSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    twitter: {
        type: String
    },
    token:  {
        type: String
    },
    member: {
        type: String
    },
    guildId: {
        type: String
    },
    screen: {
        type: String
    },
})

module.exports = mongoose.model('twitters', twitterSchema)