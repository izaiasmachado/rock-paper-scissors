const socket = io()
const wrapper = document.getElementById('game-container')

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

wrapper.addEventListener('click', (event) => {
    const element = event.target
    const play = element.alt
    const isPlayable = element.nodeName === 'IMG' && play
    
    if (!isPlayable) return
    
    socket.emit('sendPlay', play)
})

socket.on('show-max-limit', () => {
    document.getElementById('max-limit').style.display = 'block'
    document.getElementById('game-container').style.display = 'none'
})

socket.on('hide-max-limit', () => {
    document.getElementById('max-limit').style.display = 'none'
    document.getElementById('game-container').style.display = 'block'
})

socket.on('wait-for-your-opponent-to-choose', () => {
    window.alert('Wait while your opponent makes a play!')
})