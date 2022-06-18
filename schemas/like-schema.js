const mongoose = require('mongoose')


const likeSchema = mongoose.Schema({
    tweetId: {
        type: String,
    },
    userId: {
        type: String
    },
})

module.exports = mongoose.model('likes', likeSchema)