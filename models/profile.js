const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileSchema = new Schema({
    username: {
        type: Schema.Types.String,
        ref: 'User',
        required: true,
        unique: true
    },
    img: Object,
    bio: String
})

module.exports = mongoose.model('Profile', profileSchema)