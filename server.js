const express = require('express')
const expressJWT = require('express-jwt');
// updated express jwt
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')

const port = process.env.PORT

const auth = require('./routes/userAuth');
const getPosts = require('./routes/getPosts')
const getProfile = require('./routes/getProfile')
const getComments = require('./routes/getComments')
const posts = require('./routes/posts');
const profile = require('./routes/profile')
const comments = require('./routes/comments')
const votes = require('./routes/votes');
const users = require('./routes/users');

const dbURL = 'mongodb://localhost:27017/photo-share'
const secret = process.env.SECRET

app.use(express.json())
app.use(morgan('dev'))

mongoose.connect (
    process.env.MONGODB_URI || dbURL, 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    }, 
    (err) => {
        if(err) throw err;
        console.log('MongoDB connection established successfully')
    }
)

app.use('/auth', auth);
app.use('/posts', getPosts)
app.use('/profile', getProfile)
app.use('/comments', getComments)
app.use('/api', expressJWT({ secret: secret }));
app.use('/api/posts', posts);
app.use('/api/vote', votes);
app.use('/api/profile', profile)
app.use('/api/comments', comments);
app.use('/api/users', users);

app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        res.status(err.status);
    }
    return res.send( { errMsg: err.message } )
});

app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(port, () => {
    console.log(`Server is running on local port ${port}`)
})