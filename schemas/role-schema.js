const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const roleSchema = mongoose.Schema({
    guildId: reqString,
    roleId: {
        type: String,
    },
    roleName: {
        type: String,
    },
    invite: {
        type: String,
    }
})

module.exports = mongoose.model('roles', roleSchema)