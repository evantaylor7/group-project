const express = require('express')
const users = express.Router()
const User = require('../models/user.js')
const Profile = require('../models/profile.js')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')

// get all users:
users.get('/all', (req, res, next) => {
    User.find((err, users) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(users)
    })
})

// delete user (and user's profile, all user's posts, all user's comments, all comments from user's posts)
users.delete('/delete-user', async (req, res, next) => {
    try{
        const posts = await Post.find({user: req.user._id})

        await Comment.deleteMany(
            {$or: [{user: req.user._id}, {post: posts}]}
        )

        const postIdArr = posts.map(post => post._id)
        await Post.deleteMany(
            {_id: {$in: postIdArr}}
        )
        
        await Profile.findOneAndDelete(
            {username: req.user.username}
        )

        await User.findOneAndDelete(
            {_id: req.user._id}
        )
        
        return res.status(200).send('User deleted')
    }
    catch(err){
        res.status(500)
        return next(err)
    }
})

module.exports = users