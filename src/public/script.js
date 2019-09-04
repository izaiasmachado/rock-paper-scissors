const socket = io('http://localhost:3000') // This connects the frontend socket with the backend

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

socket.on('playResponse', function (data) {
    console.log(data)
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

socket.on('wait-for-you-opponent-to-choose', () => {
    window.alert('Wait while your opponent makes a play!')
})