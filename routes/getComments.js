const express = require('express')
const getComments = express.Router()
const Comment = require('../models/comment.js')

getComments.get('/:postId', (req, res, next) => {
    Comment.find(
        {post: req.params.postId}, (err, comments) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(comments)
        }
    )
})

module.exports = getComments