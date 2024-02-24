

let id;
let socket;
let connectus;
let gameName;
let roomLocale;
let writeStatur = "lobby"

let localization = {
    "ru":{
    "errors":{
            ROOM_NOT_FOUND:"Комната не найдена",
            GAME_STARTED:"Игра уже началась",
            ROOM_FULL:"Комната заполнена",
            NICKNAME_IS_NOT_ENTERED:"Введите никнейм для входа"
        }
    }
}
function connect(){
    if (connectus == 1){
        return
    }
    connectus = 1
    document.getElementById("connect").textContent = "Подключение..."
     socket = io("wss://trgu.ru/", {transports: ['websocket', 'polling', 'flashsocket']});
    const name = document.getElementById("name").value
    const code = document.getElementById("code").value.toUpperCase()
    socket.emit('clientLogin', {name: name, code: code});
    socket.on('youJoined', (data) => {
        connectus = 1
        localStorage.setItem("nameSave", data.name)
        id = data.id
        console.log("name: " + data.name)
        console.log("gameName: " + data.gameName)
        console.log("roomLocale: " + data.roomLocale)
        gameName = data.gameName
        roomLocale = data.roomLocale
        document.getElementById("content").innerHTML = `
        <img class="logo" src="images/${data.gameName}Logo_${data.roomLocale}.svg">
        
        <center>
        <p class="ingameName">${data.name}</p>
        <p id="task">Ожидание начала игры</p>
        </center>
        
        `
    })
    socket.on('errorJoin', (data) => {
        connectus = 0
        errorJoin(data)
    document.getElementById("connect").textContent = "Подключиться"
        return
    })

    socket.on('task', (data) => {
        console.log(id)
        writeStatur = "writingMessage"
        if(data.taskName == "chaosText"){
            document.getElementById("content").innerHTML = `
        <h3 id="task">${data.title}</h3>
        <input type="text" placeholder="Писать тут" id="taskplace">
        <button id="sendButton" onClick="sendAnswer()">Отправить</button>
        `
        }


    })
    
    
    socket.on('gameState', (data) => {
    
        if(data.state == "logo"){
            document.getElementById("content").innerHTML = `
            <img class="logo" src="images/${gameName}Logo_${roomLocale}.svg">
            
            `
        }
    })
}


function errorJoin(error){
    asdasdfk = document.getElementById('UpError')
    if(asdasdfk){
        document.getElementById('UpError').remove()
    }

    document.body.insertAdjacentHTML('afterbegin', `
    <div id="UpError">
    <inError>
    <div>
    <p>Ошибка</p>
    <h3>${localization["ru"]["errors"][error]}</h3>
    </div>
    <button onclick="document.getElementById('UpError').remove()">
    Агась
    </button>
    </inError>
    </div>
    `)
}


function sendAnswer(){
    
    writeStatur = ""
    socket.emit('taskSend', {taskName: "negr", type: "chaosText", valueInputs: taskplace.value, 'id': id})
    document.getElementById("content").innerHTML = `
    <img class="logo" src="images/${gameName}Logo_${roomLocale}.svg">
    
    <center>
    <p id="task">Спасибо за ответ. Ожидайте других игроков.</p>
    </center>
    
    `
}


document.addEventListener("keydown",
function(event) { 
    if (event.key === "Enter"){
        if(writeStatur == "lobby"){
           connect() 
        }
        if(writeStatur == "writingMessage"){
            sendAnswer()
        }
    }
})

