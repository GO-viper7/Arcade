const mongo = require('../handler/mongoose')
const profileSchema = require('../schemas/profile-schema.js')

const coinsCache = {}

module.exports = (client) => { }

module.exports.addCoins = async (userId, OctaCreds) => {

    const result = await profileSchema.findOneAndUpdate(
        {
            userId,
        },
        {
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

    coinsCache[`${userId}`] = result.OctaCreds

    return result.OctaCreds
} 

module.exports.getCoins = async (userId) => {
    

    return await mongo().then(async (mongoose) => {
        try {

            const result = await profileSchema.findOne({
            
                userId,
            })

            let OctaCreds = 0
            if (result) {
                console.log('goin to ret');
                OctaCreds = result.OctaCreds
            } else {
                console.log('goin to save');
                await new profileSchema({
                 
                    userId,
                    OctaCreds,
                }).save()
            }

           

            return OctaCreds
        } catch (err) {
            console.log(err)
        }
    })
}



