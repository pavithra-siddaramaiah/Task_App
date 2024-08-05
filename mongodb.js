const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const url = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true },(error,client) => {
    if(error){
        return console.log('Unable to connect')
    }
    
    const db = client.db(database)
    
    db.collection('Users').insertOne({
        name: 'pa',
        age: 25
    })

    //Update method
    db.collection('Users').updateOne({
        __id: ObjectId("12334566edsfd")
    },{$set: {name: John}
    }).then((result) => {
        console.log('Success')
    }).catch((error) => {
        console.log('Error!')
    })

    //update many

    db.collection('Users').updateMany({completed: false}, 
        {$set: {
            completed: true
        }}
    ).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    //Delete method
    //Remove all uses with age 27

    db.ccollection('Users').deleteMany({age: 27

    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })


    //Delete one from the tasks collection

db.collection('tasks').deleteOne({description: "Pot Plants"
    
}).then((result) => {
    console.log('Suceesfully removed')
}).catch((error) => {
    console.log('Failed to delete')
})
})

