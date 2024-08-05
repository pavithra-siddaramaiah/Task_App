const express = require('express')
require('./db/mongoose') 
//Database connection 
// const User = require('./models/user')
// const Task = require('./models/task')
// const router = new express.Router()
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     console.log(req.method, req.path)
//     next()
// })

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled ')
//     }
//     else {
//         next()
//     }

// })



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)




app.listen(port, () => {
    console.log('Serve is up and running on port ' + port)
})

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = jwt.sign({_id: 'abc123'},'thisismynewcourse', {expiresIn: '7 days'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }
// myFunction()

const Task = require('./models/task')
const User = require('./models/user')

// const main = async () => {
//     const task = await Task.findById('66abd5680a44e37406563437')
//     await task.populate('owner')
//     console.log(task.owner)

//     const user = await User.findById('66abd4ef0a44e37406563429')
//     await user.populate('tasks')
//     console.log(user.tasks)

// }
// main()

const multer = require('multer')

const upload = multer({
    dest: 'images',
    limits: {
        fileSize:1000000
    },
    fileFilter(req, file, cb) {
        // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error('Please upload a pdf'))
        // }
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document'))
        }

        cb(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})