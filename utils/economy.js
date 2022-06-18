const mongo = require('../handler/mongoose')
const profileSchema = require('../schemas/profile-schema.js')

const coinsCache = {}

module.exports = (client) => { }

module.exports.addCoins = async (guildId, userId, OctaCreds) => {

    const result = await profileSchema.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            $inc: {
                OctaCreds,
            },
        },
        {
            upsert: true,
            new: true,
        }
    )

    coinsCache[`${guildId}-${userId}`] = result.OctaCreds

    return result.OctaCreds
} 

module.exports.getCoins = async (guildId, userId) => {
    const cachedValue = coinsCache[`${guildId}-${userId}`]
    if (cachedValue) {
        return cachedValue
    }

    return await mongo().then(async (mongoose) => {
        try {

            const result = await profileSchema.findOne({
                guildId,
                userId,
            })

            let OctaCreds = 0
            if (result) {
                console.log('goin to ret');
                OctaCreds = result.OctaCreds
            } else {
                console.log('goin to save');
                await new profileSchema({
                    guildId,
                    userId,
                    OctaCreds,
                }).save()
            }

            coinsCache[`${guildId}-${userId}`] = OctaCreds

            return OctaCreds
        } catch (err) {
            console.log(err)
        }
    })
}



