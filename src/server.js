const fs = require('fs')
const express = require('express')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const routes = require('./routes')
app.use(routes)

fs.readdir(__dirname + '/events/', (err, files) => {
    files.forEach(file => {
        const eventHandler = require(`./events/${file}`)
        const eventName = file.split('.')[0] 
        io.on(eventName, arg => eventHandler(io, arg))
    })
})

const host = process.env.HOST || 'http://localhost'
const port = process.env.PORT || 3000

server.listen(port, () => console.log(`Running on ${host}:${port}`))