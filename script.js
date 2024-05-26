

let id;
let socket;
let connectus;
let gameName;
let roomLocale;
let writeStatur = "lobby"

let localization = {
    "ru":{
    "start": "Начать игру",
    "group": "Группа",
    "groupDejoin": "Выйти из группы",
    "errors":{
            ROOM_NOT_FOUND:"Комната не найдена",
            GAME_STARTED:"Игра уже началась",
            ROOM_FULL:"Комната заполнена",
            NICKNAME_IS_NOT_ENTERED:"Введите никнейм для входа",
            ZALUPA:"Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа Залупа"
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
    if(name == "залупа"){
        errorJoin("ZALUPA")
    }
    
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
        <img class="logo" src="logos/${data.gameName}Logo${data.roomLocale}.svg">
        
        <center>
        <p class="ingameName">${data.name}</p>
        <p id="task">Ожидание начала игры</p>
        <div id="gameDiv"></div>
        <div id="forVip"></div>
        </center>
        `
        isVip()
        checkGame()
        dId("forVip").addEventListener("click", () => {req("startGame");})
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
        <input type="text" maxlength="40" placeholder="Писать тут" id="taskplace">
        <button id="sendButton" onClick="sendAnswer()">Отправить</button>
        `
        }


    })
    
    
    socket.on('gameState', (data) => {
    
        if(data.state == "logo"){
            document.getElementById("content").innerHTML = `
            <img class="logo" src="logos/${gameName}Logo${roomLocale}.svg">`
        }
    })

    }

    function dId(arg){
        return document.getElementById(arg)
    }

    function checkGame(){
        if(gameName == "2improvisate"){
           dId("gameDiv").innerHTML = `
           <div class="impGroups">
           <div class="group">${Loc("group")} 1</div>
           <div class="group">${Loc("group")} 2</div>
           <div class="group">${Loc("group")} 3</div>
           <div class="group">${Loc("group")} 4</div></div>
           <button id="dej">${Loc("groupDejoin")}</button>
        `
        var el = 0
        var arr = document.getElementsByClassName("group")
        while (el != arr.length){
            console.log(el)
            const black = el
            arr[el].addEventListener("click", () => {
                req("joinGroup", black);
            })

            el = el +1
        }
        dId("dej").addEventListener("click", () => {
            req("dejoinGroup");
        })
        }
    }

    function isVip(){
        if(id == 0){
            dId("forVip").innerHTML = `<button>${Loc("start")}</button>`
        }
    }

function Loc(arg){
    return localization[roomLocale][arg]
}

function errorJoin(error){
    asdasdfk = document.getElementById('UpError')
    if(asdasdfk){
        document.getElementById('UpError').remove()
    }
    var black
    if(localization["ru"]["errors"][error] == undefined){
        black = error
    }
    else{
        black = localization["ru"]["errors"][error]
    }

    document.body.insertAdjacentHTML('afterbegin', `
    <div id="UpError">
    <inError>
    <div>
    <p>Ошибка</p>
    <h3>${black}</h3>
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
    socket.emit('taskSend', {taskName: "negr", type: "chaosText", valueInputs: taskplace.value})
    document.getElementById("content").innerHTML = `
    <img class="logo" src="logos/${gameName}Logo${roomLocale}.svg">
    
    <center>
    <p id="task">Спасибо за ответ. Ожидайте других игроков.</p>
    </center>
    
    `
}


function req(todo, data){
    socket.emit('do', {do:todo, param:data});
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

