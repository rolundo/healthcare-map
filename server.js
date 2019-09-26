const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Set up static file directory
app.use(express.static(path.join(__dirname, 'client/build')))

// Defines the connection string using the environment variable defined in .env
// This connection string is pulled from the MongoDB Atlas cluster page
const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const connection = mongoose.connection
connection.once('open', () => {
  console.log('MongoDB database connection established successfully')
})
connection.on('error', (e) => {
  console.log(`Error establishing connection to MongoDB: ${e.message}`)
})

const locationRouter = require('./routes/locations')

app.use('/locations', locationRouter)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})