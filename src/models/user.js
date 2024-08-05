const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Invalid Password")
            }
        }
        
    },
    age: {
        type: Number,
        required: true,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// userSchema.methods.getPublicProfile = function () {
    userSchema.methods.toJSON = function () {
    const user = this

    const userObject = user.toObject()
    //toObject gives the raw data

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('unable to login')
    }

    return user
}


//Hash the plain text passowrd before saying
//we want to do something before the event has been saved hence we use pre here, 'save' is the name of the event, we also have validator event
userSchema.pre('save', async function (next){
    const user = this
    //this has the access to the individual user that has to be saved, using 'this' always doesn't make sense so we assigned that value to user
    // console.log('Hello')
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next ()
    //next is called to make sure that we are done with the function, if next not called, it gonna hang thinking that function is still executing
})

//Delete user tasks when user is removed
userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({owner: used._id})
    next()
}) 

const User = mongoose.model('User', userSchema);

User.syncIndexes().then(() => {
    console.log('Indexes synced');
}).catch(error => {
    console.error('Index sync error:', error);
});



// const me = new User({
//     name: "ps",
//     email: "ps@gmail.com",
//     password: "pavithra12",
//     age: 25
// });

// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log("Error saving user:", error);
// });

module.exports = User