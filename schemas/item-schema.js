const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    guildId: {
        type: String,
    },
    userId: {
        type: String,
    },
    userAvatar: {
        type: String
    },
    orderId: {
        type: String,
    },
    id : {
        type: Number,
    },
    date: {
        type: String,
    },
    userName: {
        type: String,
    },
    itemName: {
        type: String,
    },
    url: {
        type: String,
    },
    category : {
        type: String,
    },
    cost : {
        type: Number,
    },
    description : {
        type: String,
    },
    premium : {
        type: Boolean,
        default: false
    },
    order: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: String
    },
    name: {
        type: String
    },
    gender: {
        type: String
    },
    country: {
        type: String
    },
    zipCode: {
        type: String
    },
    houseNumber: {
        type: String
    },
    city: {
        type: String
    },
    streetName: {
        type: String
    },
})

module.exports = mongoose.model('items', itemSchema)