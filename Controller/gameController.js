
var clientMessage = []
var clients = []
var channels = []
var start = true
var pause = false

var autostart = true
function resetGame(channel){
  this.clientMessage = []  
  this.clients.map(item=>
      {
        if(item.channel == channel){
          item.pontos = 0
        }
      })
this.getChannel(channel).roundcount = 1
 // getChannel(channel).roundcount = 1
 //console.log('channels',channels)
 console.log('resetinng.. to ',channel)
 }
    function checkWinner(usuarios,array) {       
      if(array[0].counter.includes(array[1].name)){
         return {user:usuarios[0],frase:array[0].frase[array[1].name]}
       }else if(array[1].counter.includes(array[0].name)){
        return {user:usuarios[1],frase:array[1].frase[array[0].name]}
       }else{
        return false
       }
    }
    function lastMessage(id,channel){
      console.log('lastmessage','called',this.clientMessage.length)
      for(var i = 0; i < this.clientMessage.length;i++){
        if(this.clientMessage[i].user != id && this.clientMessage[i].channel === channel){
          return this.clientMessage[i]
        }
      }
    }
    function deleteChannel(channel){
  
      for(var i = 0; i < this.channels.length;i++){
        if(this.channels[i].channel === channel){
          this.channels.splice(i,1) 
        }
      }
    }
    function getChannel(channel){
  
      for(var i = 0; i < this.channels.length;i++){
        if(this.channels[i].channel === channel){
          return this.channels[i]
        }
      }
    }
  function getUser(id){
    for(var i = 0;i < clients.length;i++){
      if(clients[i].id == id){
        return clients[i]
      }
    }
  }
  function userWelcome(userid,io){
    io.to(userid).emit('chat message',`Welcome, ${getUser(userid).username}. type /command to show all commands and /info to see the rules.`)
    for(var i = 0;i < clients.length;i++){
      if(clients[i].id != userid){
       io.to(clients[i].id).emit('chat message',`The User ${getUser(clients[i].id).username} joined the game. Welcome!`)
      }
    }

    io.to(userid).emit('chat message',`Your name is ${getUser(userid).username} you can type /username <newusername> to change your name. `)
    clients.map(client=>{
     if(client.id != userid){
       io.to(userid).emit('chat message','You are playing with ' + client.username)
     }
   })
   io.emit('chat message', `This game will be played for ${round > 1 ? round+' rounds': round + ' round'} `)
   
    if(clients.length != 2){
     io.emit('chat message', 'Waiting for players....');
     clientMessage = []
   }
  }

    module.exports = {
        resetGame,
        start,
        checkWinner,
        getChannel,
        channels,
        getUser,
        pause,
        deleteChannel,
        lastMessage,
        autostart,
        userWelcome,
        clients,
        clientMessage
    }
