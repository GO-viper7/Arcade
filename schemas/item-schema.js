const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    guildId: {
        type: String,
    },
    userId: {
        type: String,
    },
    name: {
        type: String,
    },
    url: {
        type: String,
    },
    category : {
        type: String,
    } 
})

module.exports = mongoose.model('items', itemSchema)