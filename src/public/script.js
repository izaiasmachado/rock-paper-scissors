const socket = io()

socket.on('serverResponse', function (data) {
    if (data == 'draw') {
        window.alert('Draw!')
    } else {
        if (socket.id == data) {
            window.alert('You won!')
        } else {
            window.alert('You lose :/')
        }
    }
})

socket.on('show-max-limit', () => {
    document.getElementById('max-limit').style.display = 'block'
    document.getElementById('game-container').style.display = 'none'
})

socket.on('hide-max-limit', () => {
    document.getElementById('max-limit').style.display = 'none'
    document.getElementById('game-container').style.display = 'block'
})

function actionRock() {
    socket.emit('sendPlay', 'rock')
}

function actionPaper() {
    socket.emit('sendPlay', 'paper')
}

function actionScissors() {
    socket.emit('sendPlay', 'scissors')
}

socket.on('wait-for-your-opponent-to-choose', () => {
    window.alert('Wait while your opponent makes a play!')
})