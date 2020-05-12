const express = require('express')
const getPosts = express.Router()
const Post = require('../models/post.js')

// get all posts
getPosts.get('/', (req, res, next) => {
    Post.find((err, posts) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(posts)
    })
})

// get (other) user's posts
getPosts.get('/user/:username', (req, res, next) => {
    Post.find({postedBy: req.params.username}, (err, posts) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(posts)
    })
})

// get one post
getPosts.get('/detail/:postId', (req, res, next) => {
    Post.findOne(
        { _id: req.params.postId},
        (err, post) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(post)
        }
    )
})

module.exports = getPosts