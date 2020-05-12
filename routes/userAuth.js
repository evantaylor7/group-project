const express = require('express')
const userAuth = express.Router()
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

// signup
userAuth.post('/signup', (req, res, next) => {
    User.findOne({username: req.body.username.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500)
            return next(err)
        }
        if(user){
            res.status(403)
            return next(new Error('That username is already taken'))
        }
        const newUser = new User(req.body)
        newUser.save((err, savedUser) => {
            if(err){
                res.status(500)
                return next(err)
            }
            const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET);
            return res.status(201).send({
                token,
                user: savedUser.withoutPassword(),
                success: true
            })
        })
    })
})

// login
userAuth.post('/login', (req, res, next) => {
    User.findOne({username: req.body.username.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500)
            return next(err)
        }
        if(!user){
            res.status(403)
            return next(new Error('Username is incorrect'))
        }
        user.checkPassword(req.body.password, (err, isMatch) => {
            if (err) {
                res.status(403);
                return next(new Error('Username or password are incorrect'));
            }
            if (!isMatch) {
                res.status(403);
                return next (new Error('Username or password are incorrect'));   
            }
            const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
            return res.status(200).send({
                token,
                user: user.withoutPassword(),
                sucess: true
            })
        }) 
    })
})

module.exports = userAuth