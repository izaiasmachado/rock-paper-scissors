const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app) // Defines http protocol
const io = require('socket.io')(server) // Defines wss protocol

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let play = {}
let plays = []
let players = []

io.on('connection', socket => {
    if (io.engine.clientsCount > 2) {
        socket.emit('show-max-limit')
        return socket.conn.close()
    } else {
        players.push(socket.id)
        socket.emit('hide-max-limit')
    }

    socket.on('sendPlay', data => {
        if (socket.id == players[0]) {
            if (!play.p1) {
                play.p1 = data
                socket.emit('playResponse', `P1:${data}`)
            } else {
                socket.emit('wait-for-you-opponent-to-choose')
            }
        }

        if (socket.id == players[1]) {
            if (!play.p2) {
                play.p2 = data
                socket.emit('playResponse', `P2:${data}`)
            } else {
                socket.emit('wait-for-you-opponent-to-choose')
            }
        }

        if (play.p1 && play.p2) {
            const winner = rpsRules(play.p1, play.p2)

            if (winner) {
                socket.broadcast.emit('serverResponse', `You lose :/`)
                socket.emit('serverResponse', `You won!`) // This send the message to everyone BUT the sender
                console.log(`${winner} won this round`)
            } else {
                socket.broadcast.emit('serverResponse', `draw`)
                socket.emit('serverResponse', `draw`)
            }

            plays.push(play)
            play = {}
        }
    })

    removeInactivePlayers(socket)
    console.log(players)
})

server.listen('3000', () => console.log(`Running on http://localhost:3000/`))

function rpsRules(p1, p2) {
    if (p1 == p2) {
        return false
    } else {
        if (p1 == 'rock' && p2 == 'paper')
            return 'P2'
        if (p1 == 'paper' && p2 == 'rock')
            return 'P1'
        if (p1 == 'paper' && p2 == 'scissors')
            return 'P2'
        if (p1 == 'scissors' && p2 == 'paper')
            return 'P1'
        if (p1 == 'rock' && p2 == 'scissors')
            return 'P1'
        if (p1 == 'scissors' && p2 == 'rock')
            return 'P2'
    }
}

function removeInactivePlayers(socket) {
    for (let i = 0; i < players.length; i++) {
        if (!io.sockets.sockets[players[i]]) {
            const removed = players.splice(i, 1)
            console.log(`${removed} was removed.`)
        }
    }
}