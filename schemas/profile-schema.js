const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const profileSchema = mongoose.Schema({
    guildId: reqString,
    userId: {
        type: String,
    },
    OctaCreds: {
        type: Number,
        default: 0,
    },
    Passive: {
        type: Number,
        default: 0
    },
    twitter: {
        type: String
    }
})

module.exports = mongoose.model('profiles', profileSchema)