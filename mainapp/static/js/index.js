    // grab elems from the chat

        // const sentArea = document.querySelector('.sent')
        // const receivedArea = document.querySelector('.received')
        const messageArea = document.querySelector('.message_area');
        const messageInputDom = document.querySelector('#chat-message-input');
        const messageInputSubmit = document.querySelector('#chat-message-submit');

        // const player = username.charAt(0);
        let iClicked = false;
        const socket = new WebSocket('ws://localhost:8000/ws/game/' +room_code)

        let gameState = ["","","","","","","","",""]   // initially

        const elementArray = document.querySelectorAll('.space')  // select all the boxes

        // whenever the box gets clicked
        elementArray.forEach(function(elem){
            elem.addEventListener("click",function(e){
                setText(e.path[0].dataset.cellIndex,player)
            })
        })


        messageInputDom.focus();
        messageInputDom.onkeyup = function(e) {
            if (e.keyCode === 13) {  // enter, return
                messageInputSubmit.click();
            }
        };

        messageInputSubmit.onclick = function(e) {
            // const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;

            if (message === "" || message === undefined)
            {
               swal("Sorry!","No message written","warning")
               return;
            }
            
            messageInputSubmit.disabled = true
            socket.send(JSON.stringify({
                'data' : {
                    'info':'chat',
                    'user':username,
                    'message':message,
                }
            }));
            messageInputDom.value = '';
        };

        // checks if the game has ended or not
        function checkGameEnd() {
            let count = 0;
            gameState.map((game) => {
                if(game != "") {
                    count++;
                }
            })

            if(count >= 9) {  // this means all the boxes are filled and the game has to be ended
                const data = {'info' : 'over'}
                socket.send(JSON.stringify({data}))
                gameComplete("Game Over" , "No one won" , "warning")
            }
        }

        // check who won
        function checkWon(value , player){
            let won = false;

            if(gameState[0] === value && gameState[1] == value && gameState[2] == value){   // if 1st row has same values
                won = true;
            }
            else if(gameState[3] === value && gameState[4] == value && gameState[5] == value){    // if 2nd row has same values
                won = true
            }
            else if(gameState[6] === value && gameState[7] == value && gameState[8] == value){     // if 3rd row has same values
                won = true
            }
            else if(gameState[0] === value && gameState[3] == value && gameState[6] == value){      // if 1st col has same values
                won = true
            }
            else if(gameState[1] === value && gameState[4] == value && gameState[7] == value){      // if 2nd col has same values
                won = true
            }
            else if(gameState[2] === value && gameState[5] == value && gameState[8] == value){      // if 3rd col has same values
                won = true
            }
            else if(gameState[0] === value && gameState[4] == value && gameState[8] == value){      // if 1st diagonal has same values
                won = true
            }
            else if(gameState[2] === value && gameState[4] == value && gameState[6] == value){      // if 2nd diagonal has same values
                won = true
            }

            if(won){
                const data = {'info' : 'end' , 'player' : player}
                socket.send(JSON.stringify({data}))   
                gameComplete("Good job!" , "You won" , "success")
            }

            checkGameEnd();

        }


        // sets the character in the box whenever the box is clicked
        function setText(index,value){
            index = parseInt(index)


            if(gameState[index] == "" && iClicked === false)
                {
                    gameState[index] = value
                    elementArray[index].innerHTML = value
                    iClicked = true;

                    socket.send(JSON.stringify(
                        {
                            'data' : {
                                'info': 'running',
                                'player':player,
                                'index': index,
                                
                            }
                        }
                    ))
                    
                    // check either anyone won after every click
                    checkWon(value , player )
                }
            else if (iClicked) {
                swal("Sorry!","Not Your Turn","warning")
            }
            else{
                swal("Sorry!","This box is already filled","warning")
            }

        }

        function setAnotherUserText(index,value) {
            index = parseInt(index)

            gameState[index] = value
            elementArray[index].innerHTML = value
            iClicked = false;

        }

        // whenever the game gets completed show the popup box and clear the boxes to restart the game 
        function gameComplete(a,b,c) {
            swal(a,b,c)
            gameState = ["","","","","","","","",""]
            elementArray.forEach((elems)=> {
                elems.innerHTML = ''
            })
            iClicked = false

        }

        function writeMessage(msg,user) {

            const sent = document.createElement('div')
            sent.setAttribute('class','sent')

            const received = document.createElement('div')
            received.setAttribute('class','received')
            
            const msgDiv = document.createElement("div")
            // msgDiv.setAttribute('class','msg')
            const msgText = document.createElement("p")
            msgText.innerHTML = msg
            msgDiv.appendChild(msgText)

            if(user === username){
                msgDiv.setAttribute("class","msg sendmsg")
                sent.appendChild(msgDiv)
                messageArea.appendChild(sent)
            }

            else {
                msgDiv.setAttribute("class","msg receivedmsg")
                received.appendChild(msgDiv)
                messageArea.appendChild(received)

            }
        }

        // whenever the connection is established
        socket.onopen = function(e) {
            console.log("socket connected")
        }

        // when message is received
        socket.onmessage = function(e) {    
            const data = JSON.parse(e.data ) // we receive this data from the backend
            console.log(data)


            if(data.payload.info == 'end' && data.payload.player !== player){
                gameComplete("Sorry!" , "You lost" , "error")

            }

            else if(data.payload.info == 'over'){
                gameComplete("Game over!" , "Game ended no one won" , "warning")
                return;
            }

            else if(data.payload.info == 'running' &&  data.payload.player !== player){
                setAnotherUserText(data.payload.index , data.payload.player)
            }

            else if (data.payload.info == "chat" && data.payload.message !== undefined) {
            // message part, appending the message
            // document.querySelector('#chat-log').value += (data.payload.message + '\n');
            writeMessage(data.payload.message,data.payload.user)
            }
            

        }

        // whenever the connection is closed
        socket.onclose = function (e){
            console.log('Socket closed')
        }
