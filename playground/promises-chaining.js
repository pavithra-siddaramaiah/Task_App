require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('66a0fe6d573d4d8d139ccfcf', {age: 1}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age: 34})
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeCount = async (id, age) => {
    await User.findByIdAndUpdate(id, {age}, { new: true })
    const count = await User.countDocuments({age})
    return count
}


updateAgeCount('66a0fe6d573d4d8d139ccfcf', 2 ).then((count) => {
    console.log(count)
}).catch((err) => {
    console.log(err)
})