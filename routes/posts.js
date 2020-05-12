const express = require('express')
const posts = express.Router()
const Post = require('../models/post.js')
const Profile = require('../models/profile.js')

// new post
posts.post('/', async (req, res, next) => {
    req.body.user = req.user._id
    req.body.postedBy = req.user.username
    try{
        const profile = await Profile.findOne({username: req.user.username})
        if(profile && profile.img){
            req.body.userImg = profile.img.imgUrl
        }
        const newPost = new Post(req.body)
        const newPostObj = await newPost.save()
        return res.status(201).send(newPostObj)
    }
    catch(err){
        res.status(500)
        return next(err)
    }
})

// get (logged in) user's posts
posts.get('/current-user', (req, res, next) => {
    Post.find({ user: req.user._id }, (err, posts) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(posts)
    })
})

// delete post
posts.delete('/:postId', (req, res, next) => {
    Post.findOneAndDelete(
        {_id: req.params.postId, user: req.user._id}, 
        (err, deletedPost) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(`Your post was deleted` + deletedPost)
        }
    )
})

// update post
posts.put('/:postId', (req, res, next) => {
    Post.findOneAndUpdate(
        {_id: req.params.postId, user: req.user._id},
        req.body,
        {new: true},
        (err, updatedPost) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(updatedPost)
        }
    )
})

// update user icons
posts.put('/profile/:username', (req, res, next) => {
    Post.updateMany(
        {postedBy: req.params.username},
        {userImg: req.body.data},
        {new: true},
        (err, updatedPosts) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(updatedPosts)
        }
    )
})

module.exports = posts