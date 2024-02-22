const socket = io("wss://trgu.ru:4020", {transports: ['websocket', 'polling', 'flashsocket']});

let id;

function connect(){
    const name = document.getElementById("name").value
    const code = document.getElementById("code").value.toUpperCase()
    socket.emit('clientLogin', {name: name, code: code});
    socket.on('youJoined', (data) => {
        id = data.id
        console.log(data.name)
        document.getElementById("content").innerHTML = `
        <p>Ваше имя ${data.name}<p/>
        <p id="task">Ожидание начала игры</p>
        `
    })
    socket.on('errorJoin', (data) => {
        alert(data)
    })
}

socket.on('task', (data) => {
    console.log(id)
    if(data.taskName == "chaosText"){
        document.getElementById("content").innerHTML = `
    <h3 id="task">${data.title}</h3>
    <input type="text" placeholder="Писать тут" id="taskplace">
    <button onclick="sendTask()">Отправить</button>
    `
    }
})


socket.on('gameState', (data) => {

    if(data.state == "logo"){
        document.getElementById("content").innerHTML = `
    `
    }
})