const express = require('express')
const getProfile = express.Router()
const Profile = require('../models/profile.js')

// get profile
getProfile.get('/:username', (req, res, next) => {
    Profile.findOne(
        {username: req.params.username},
        (err, profile) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(200).send(profile)
        }
    )
})

module.exports = getProfile