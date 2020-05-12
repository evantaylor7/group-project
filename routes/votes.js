const express = require('express')
const votes = express.Router()
const Post = require('../models/post.js')

// upvote post
votes.put('/upvote/:postId', (req, res, next) => {
    Post.findOne({_id: req.params.postId}, (err, post) => {
        if(post.usersWhoHaveVoted.includes(req.user._id)){
            res.status(403)
            return next(Error('You can only vote once per post'))
        } else {
            Post.findOneAndUpdate(
                {_id: req.params.postId},
                {
                    $inc: {votes: 1},
                    $push: {usersWhoHaveVoted: req.user._id}
                },
                {new: true},
                (err, updatedPost) => {
                    if(err){
                        res.status(500)
                        return next(err)
                    }
                    return res.status(201).send(updatedPost)
                }
            )
        }
    })
})

// downvote post
votes.put('/downvote/:postId', (req, res, next) => {
    Post.findOne({_id: req.params.postId}, (err, post) => {
        if(post.usersWhoHaveVoted.includes(req.user._id)){
            res.status(403)
            return next(Error('You can only vote once per post'))
        } else {
            Post.findOneAndUpdate(
                {_id: req.params.postId},
                {
                    $inc: {votes: -1},
                    $push: {usersWhoHaveVoted: req.user._id}
                },
                {new: true},
                (err, updatedPost) => {
                    if(err){
                        res.status(500)
                        return next(err)
                    }
                    return res.status(201).send(updatedPost)
                }
            )
        }
    })
})

module.exports = votes