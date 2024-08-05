require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('66a105004d268774be454027',).then((task) => {
//     console.log(task)
//     return Task.countDocuments({completed: true})
// }).then((result) => {
//         console.log(result)
//     }).catch((e) => {
//         console.log(e)
//     })

//also please add the count't method inside

const deleteAndCount = async (id, status) => {
    await Task.findByIdAndDelete(id)
    const count = Task.countDocuments({completed: status})
    return count
}

deleteAndCount('66a6f341ff1d9ddb7a178b9b','true').then((count) => {
    console.log(count)
})