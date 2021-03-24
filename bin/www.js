#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('spock:server');
var http = require('http').Server(app);
var io = require('socket.io')(http);



var clientMessage = []
var clients = []
var round = 1
var roundCount = 1
var port = normalizePort(process.env.PORT || '80');
app.set('port', port);
var commands = {
  round : {
    name:'round',
    description:'Choose how much rounds will played.',
    command:'round'
  },
  start : {
    name:'start',
    description:'Start the game. This is manual mode to start the game.',
    command:'start'
  },
  stop : {
    name:'stop',
    description:'Stop the game and reset all points.',
    command:'stop'
  },
  auto : {
    name:'auto',
    description:'Set round to automatic mode. The mode will start again after end.',
    command:'auto'
  },
  pause : {
    name:'pause',
    description:'Pause the game.',
    command:'pause'
  },
  ponto : {
    name:'ponto',
    description:'Show your points.',
    command:'ponto'
  },
  info:{
    name:'info',
    description:'Show info about the game.',
    command:'info'
  },
  clear:{
    name:'clear',
    description:'Clear all chat',
    command:'clear'
  },
  scroll:{
    name:'scroll',
    description:'set auto scroll to true or false.',
    command:'scroll'
  },
  username:{
    name:'username',
    description:'set user username.',
    command:'username'
  },
  command:{
    name:'command',
    description:'Show all commands.',
    command:'command'
  },
  board:{
    name:'board',
    description:'Show board of the best game of world.',
    command:'board'
  }

}
var obj = {
 tesoura: {
    name: 'tesoura',
    counter: ['papel', 'lagarto'],
    frase:{'papel': 'Tesoura corta papel.',
    'lagarto': 'Tesoura decapita lagarto.'}
  },
   papel :{
    name: 'papel',
    counter: ['pedra', 'spock'],
    frase:{'pedra': 'Papel cobre pedra.',
    'spock': 'Papel refuta Spock.'}
  },
   pedra: {
    name: 'pedra',
    counter: ['lagarto', 'tesoura'],
    frase:{'lagarto': 'Pedra esmaga lagarto.',
    'tesoura': 'Pedra esmaga tesoura.'}
  },
   lagarto :{
    name: 'lagarto',
    counter: ['spock', 'papel'],
    frase:{'spock': 'Lagarto envenena Spock.',
    'papel': 'Lagarto come papel.'}
  },
   spock : {
    name: 'spock',
    counter: ['tesoura', 'pedra'],
    frase:{'tesoura': 'Spock esmaga tesouras',
    'pedra': 'Spock vaporiza pedra.'}
  }
}
const prefix = "/";

  function checkWinner(usuarios,array) {       
    if(array[0].counter.includes(array[1].name)){
       return {user:usuarios[0],frase:array[0].frase[array[1].name]}
     }else if(array[1].counter.includes(array[0].name)){
      return {user:usuarios[1],frase:array[1].frase[array[0].name]}
     }else{
      return false
     }
  }
function getUser(id){
  for(var i = 0;i < clients.length;i++){
    if(clients[i].id === id){
      return clients[i]
    }
  }
}
io.on('connection', function(socket){
 var start = true
 var pause = false
 var autostart = true

 function resetGame(){
  clients.map(item=>
    {
      item.pontos = 0
    })
    roundCount = 1
    clientMessage = []
    console.log('reseting all..',roundCount,round)
  }
 clients.push({id:socket.id,pontos:0,username:socket.id})
 //io.emit('chat message', `The User ${getUser(socket.id).username} joined the game. Welcome!`)
 io.to(socket.id).emit('chat message',`Welcome, ${getUser(socket.id).username}. type /command to show all commands and /info to see the rules.`)
 for(var i = 0;i < clients.length;i++){
   if(clients[i].id != socket.id){
    io.to(clients[i].id).emit('chat message',`The User ${getUser(clients[i].id).username} joined the game. Welcome!`)
   
   }
 }

 function commandExec(message){

  if (message.startsWith(prefix)){
    const commandBody = message.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
   if(commands[command]){

    if (commands[command].command === 'username') {
      const numArgs = args.map(x => x);

     io.emit('chat message', `The user changed their username from  ${getUser(socket.id).username} to ${numArgs[0]}`)
     getUser(socket.id).username = numArgs[0]
    }
    if (commands[command].command === 'board') {
      clients.map(item=>
        {
          io.to(socket.id).emit('chat message',`Usuário:${item.username} Pontos:${item.pontos} `)
        })
    }
    if (commands[command].command === 'command') {
      for(var i in commands){
      io.to(socket.id).emit('chat message',{type:1,message:`<center><h1>/${commands[i].command} - ${commands[i].description}</h1> <br/>`})
      }
     }
    
   if (commands[command].command === 'round') {
      const numArgs = args.map(x => x);
     round = parseInt(numArgs[0])
     roundCount = 1
     clientMessage = []
     console.log(clientMessage,roundCount,round)
      io.emit('chat message', `Essa partida será definida em ${round} rounds`)
      
    }
    if (commands[command].command === 'scroll') {
      io.to(socket.id).emit('config','scroll')
      io.to(socket.id).emit('chat message','Setting auto scroll.')
    }
    if (commands[command].command === 'clear') {
      io.to(socket.id).emit('config','clear')
    }
    else if (commands[command].command === 'info') {
      var info = ' <center><h3>Digite uma opção abaixo na entrada para fazer uma jogada.</h3><h1>Regras</h1><br/><h2>tesoura corta papel<br/>papel cobre pedra<br/>pedra esmaga lagarto<br/>lagarto envenena Spock<br/>Spock esmaga tesoura<br/>tesoura decapita lagarto<br/>lagarto come o papel<br/>papel refuta Spock<br/>Spock vaporiza a pedra<br/>pedra esmaga tesoura</h2>'
      io.to(socket.id).emit('chat message',{type:1,message:info})
    }
   else if (commands[command].command === "start") {
     io.emit('chat message','Partida iniciada por ' + socket.id)
     start = true
     resetGame()
    }
   else if (commands[command].command === "stop") {
      io.emit('chat message','Partida parada por ' + socket.id)
      start = false
     }
    else if (commands[command].command === "ponto") {
var pontos = 0
      clients.map(item=>
        {
          if(item.id == socket.id){
            pontos = item.pontos
          }
        })
      io.to(socket.id).emit('chat message','Pontos: ' + pontos)
      start = false
     }
    else if (commands[command].command === "auto") {
      io.emit('chat message','Modo de rounds automáticos definidos por ' + socket.id + ' status: ' + autostart)
      if(autostart){
        autostart = false
      }else{
        autostart = true
      }
     }
     else if (commands[command].command === "pause") {
      io.emit('chat message','Jogo pausado por ' + socket.id + ' status: ' + autostart)
      if(autostart){
        pause = false
      }else{
        pause = true
      }
    }
     }else{
      io.to(socket.id).emit('chat message','Cant recognize this command.')
     }
     return true
    }else{
      return false
    }
}

io.to(socket.id).emit('chat message',`Your name is ${getUser(socket.id).username} you can type /username <newusername> to change your name. `)
 clients.map(client=>{
  if(client.id != socket.id){
    io.to(socket.id).emit('chat message','You are playing with ' + client.username)
  }
})
io.emit('chat message', `This game will be played for ${round > 1 ? round+' rounds': round + ' round'} `)

 if(clients.length != 2){
  io.emit('chat message', 'Waiting for players....');
  clientMessage = []
}

  socket.on('chat message', function(msg){
    if(commandExec(msg)){
      console.log(socket.id + ' executou o comando ' + msg)
  return 
  }
  if(clients.length == 2){  

  if(start && !pause){
    var lastmessage = clientMessage[clientMessage.length - 1]
    io.to(socket.id).emit('chat message','Você escolheu: ' +msg)
    if(!obj[msg.toLowerCase()]){
      io.to(socket.id).emit('chat message','Essa opção não existe: ' +msg)
return 
    }

console.log(clientMessage)
   if(lastmessage){
if(lastmessage.user != socket.id){
  var winner = checkWinner([socket.id,lastmessage.user],[obj[msg.toLowerCase()], obj[lastmessage.msg.toLowerCase()]])
  if(winner){
    //io.emit('chat message',`ROUND ${round} - ${getUser(winner.user).username} ganhou 1 ponto!`)
       io.emit('info',`<center>ROUND ${roundCount} - ${getUser(winner.user).username} Ganhou 1 ponto! - ${winner.frase}</center>`)
       clientMessage = []
  }else{
    io.emit('info',`<center>ROUND ${roundCount} - Empate!</center>`)
    clientMessage = []
  }
  clients.map(item=>
    {
      if(item.id == winner.user){
        item.pontos += 1
        console.log(getUser(winner.user).username)
      }
    })
  if(roundCount >= round){
   
 io.emit('info', `<center>${round > 1 ? round+' rounds': round + ' round'}</center>`)
   io.emit('info', '<center>Round finished.</center>')
   io.emit('info', '<center><h1>Result</h1></center>')
   
   clients.map(item=>
     {
     
 if(item.id == winner.user){
         io.emit('info', {message:`<h2><center>Vencedor: ${item.username} Pontos: ${item.pontos}</center></h2>`,time:5000})
 }else{
  io.emit('info', {message:`<h2><center>Usuário:${item.username} Pontos:${item.pontos}<br/></center></h2>`,time:5000})
 }
     })
     if(autostart){
      resetGame()
      io.emit('chat message', `Round reiniciado! ${round > 1 ? round+' rounds': round + ' round'} `)
     }else{
       io.emit('chat message', 'Inicie a partida com o comando /start')
     }
     return 
 }

    roundCount++  
    
   
  
  
      
     
}

   }

  
  
 for(var i=0;i < clientMessage.length;i++){
  if(clientMessage[i].user.includes(socket.id)){
    clientMessage.splice(i,1)
console.log('user already spoke')
  }
 }
 console.log('#####test',clientMessage)
  clientMessage.push({user:socket.id,msg})
 
 
 

  

   
  }
}else if(clients.length > 2){
  io.to(socket.id).emit('chat message','Many users in the game. Wait for a free space.')
} 
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    for(var i= 0; i< clients.length;i++){
      if(clients[i].id == socket.id){
        console.log('removing.. ' + clients[i].username)
        io.emit('chat message', `The user ${clients[i].username} left the game.`)
        clients.splice(i,1)
      }
    }
  });

  
});


/**
 * Create HTTP server.
 */



/**
 * Listen on provided port, on all network interfaces.
 */

http.listen(port);
http.on('error', onError);
http.on('listening', onListening);


/**
 * Normalize a port into a number, string, or false.
 */
 

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly clientMessage
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = http.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
