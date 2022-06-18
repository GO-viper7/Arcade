const mongoose = require("mongoose")

const shopSchema = mongoose.Schema({
    guildId: String,
    item: String,
    price: Number,
    amount: Number
})

module.exports = mongoose.model("shop", shopSchema)