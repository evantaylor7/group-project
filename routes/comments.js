const express = require('express')
const comments = express.Router()
const Comment = require('../models/comment.js')
const Profile = require('../models/profile.js')

comments.post('/post/:postId', async (req, res, next) => {
    req.body.post = req.params.postId
    req.body.user = req.user._id
    req.body.postedBy = req.user.username
    try{
        const profile = await Profile.findOne({username: req.user.username})
        if(profile && profile.img){
            req.body.userImg = profile.img.imgUrl
        }
        const newComment = new Comment(req.body)
        const newCommentObj = await newComment.save()
        return res.status(201).send(newCommentObj)
    }
    catch(err){
        res.status(500)
        return next(err)
    }
})

comments.delete('/:commentId', (req, res, next) => {
    Comment.findOneAndDelete(
        {_id: req.params.commentId, user: req.user._id}, 
        (err, deletedComment) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send('Your comment was deleted' + deletedComment)
        }
    )
})

comments.put('/:commentId', (req, res, next) => {
    Comment.findOneAndUpdate(
        {_id: req.params.commentId, user: req.user._id},
        req.body,
        {new: true},
        (err, updatedComment) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(updatedComment)
        }
    )
})

// update user icons
comments.put('/profile/:username', (req, res, next) => {
    Comment.updateMany(
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

module.exports = comments