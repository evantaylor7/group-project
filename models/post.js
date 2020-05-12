const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postedBy: {
        type: Schema.Types.String,
        ref: 'User',
        required: true
    },
    userImg: String,
    img: {
        type: Object,
        required: true
    },
    description: String,
    votes: {
        type: Number,
        default: 0
    },
    dateAdded: {
        type: String
    },
    usersWhoHaveVoted: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    }
})

module.exports = mongoose.model('Post', postSchema)