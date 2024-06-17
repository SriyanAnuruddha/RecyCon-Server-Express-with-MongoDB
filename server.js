const configs = require('./config/configs') // import configurations
const express = require('express')
const mongoose = require('mongoose')
const usersRoutes = require('./routes/users.route')
const { PORT, DB_URI } = configs

// import middlewares
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', usersRoutes)

mongoose.connect(DB_URI).then(
    () => {
        console.log("Database is Connected!")
        app.listen(PORT, () => console.log(`Server is running ${PORT}`))
    },
    (error) => { console.log(error) }
)



