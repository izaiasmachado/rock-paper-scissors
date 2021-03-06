const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let play = {}
let players = []

io.on('connection', socket => {
    if (io.engine.clientsCount > 2) {
        socket.emit('show-max-limit')
        socket.conn.close()
    } else {
        players.push(socket.id)
        socket.emit('hide-max-limit')
    }

    socket.on('sendPlay', data => {
        if (socket.id == players[0]) {
            if (!play.p1) {
                play.p1 = data
            } else {
                socket.emit('wait-for-your-opponent-to-choose')
            }
        }

        if (socket.id == players[1]) {
            if (!play.p2) {
                play.p2 = data
            } else {
                socket.emit('wait-for-your-opponent-to-choose')
            }
        }

        if (play.p1 && play.p2) {
            const winner = rpsRules(play.p1, play.p2)

            if (winner) {
                if (winner == 'P1') {
                    socket.broadcast.emit('serverResponse', `${players[0]}`)
                    socket.emit('serverResponse', `${players[0]}`)
                } if (winner == 'P2') {
                    socket.broadcast.emit('serverResponse', `${players[1]}`)
                    socket.emit('serverResponse', `${players[1]}`)
                }
            } else {
                socket.broadcast.emit('serverResponse', `draw`)
                socket.emit('serverResponse', `draw`)
            }

            play = {}
        }
    })

    removeInactivePlayers(socket)
})

const port = 3000

server.listen(port, () => console.log(`Running on http://localhost:${port}`))

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

function removeInactivePlayers() {
    for (let i = 0; i < players.length; i++) {
        if (!io.sockets.sockets[players[i]]) {
            players.splice(i, 1)
        }
    }
}