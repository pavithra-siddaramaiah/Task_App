const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
 
    try {
     await user.save()
     const token = await user.generateAuthToken()
     res.send({user, token})
    }
    catch (e) {
        if (e.code === 11000) {
            res.status(400).send({ error: 'Email already exists' });
        } else {
            res.status(400).send(e);
        }
    }
 
 //    user.save().then(() => {
 //     res.send(user)
 //    }).catch((e) => {
 //     res.status(400).send(e)
 //    })
 })

 

 router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //here User is a colection means fo rall users
        const token = await user.generateAuthToken()
        //here were are using user which corresponds to the individual user
        // res.send({user: user.getPublicProfile(), token})
        //there is also no need to create a function and call, that function can be just replaced with toJSON in modals

        res.send({user, token})
    }
    catch (e) {
        res.status(400).send()
    }
 })

 router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }
    catch (e) {
        res.status(500).send()
    }
 })

 router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e){
        res.status(500).send()
    }
 })
 
 router.get('/users/me', auth, async (req, res) => {
    try{
        const users = await User.find({})
        res.send(req.user)
    }
    catch(e) {
        res.status(500).send(e)
    }
    //  User.find({}).then((users) => {
    //      res.send(users)
    //  }).catch((e) => {
    //      res.status(500).send(e)
    //  })
 })
 
 router.get('/users/:id', async (req, res) => {
     const __id = req.params.id
 
     try {
         const user = await User.findById(__id)
 
         if(!user){
             return res.status(404).send()
         }
         res.send(user)
     }
     catch (e) {
         res.status(500).send()
     }
     // User.findById(__id).then((user) => {
     //     res.send(user)
     // }).catch((e) => {
     //     res.status(404).send(e)
     // })
 })
 // Watch this video again
 router.patch('/users/me', auth,  async (req, res) => {
     const updates = Object.keys(req.body)
     const allowedUpdates = ['name', 'email','password','age']
     const isValidOperation = updates.every((update) => {
         return allowedUpdates.includes(update)
     })
 
     if(!isValidOperation){
         return res.status(400).send({error: 'Invalid updates!'})
     }
 
     try {

        // const user = await User.findById(req.params.id)

        updates.forEach((update) => {
        
            req.user[update] = req.body[update]
            //bracket notation is to dynamically update the values
        })
        await req.user.save()
        //  const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
 
         if(!req.user){
             return res.status(400).send()
         }
         
         res.send(req.user)
     }
     catch (e){
         res.status(400).send(e)
     }
 })
 
 //deleting the user
 router.delete('/users/me', auth,  async (req, res) => {
    
    //  try {
        //  const user = await User.findByIdAndDelete(req.user._id)
 
        //  if(!user){
        //      res.status(400).send('Invalid input id')
        //  }
        // await req.user.remove()
        // res.send(req.user)
        //  res.send(user)
    //  }
    //  catch (e) {
    //      res.status(500).send(e)
    //  }

    try {
        if (!req.user) {
            return res.status(404).send({ error: 'User not found' })
        }

        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        console.error('Error occurred while deleting user:', e)
        res.status(500).send({ error: 'Internal Server Error' })
    }
 })

 const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Image type is unacceptable'))
        }

        cb(undefined,true)
    }
 })
 router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({weight: 250, height: 250}).png().toBuffer()
    // req.user.avatar = req.file.buffer
    req.user.avatar = buffer
    await req.user.save()
    res.send()
    
 }, (error, req, res, next) => {
    res.status(400).send({error: error.message})
 })
 
 router.delete('/users/me/avatar', auth, async(req, res) =>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('Profile picture successfully deleted')
 })

 router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/jpeg'); 
        res.send(user.avatar); 
    } catch (e) {
        res.status(400).send();
    }
});


module.exports = router