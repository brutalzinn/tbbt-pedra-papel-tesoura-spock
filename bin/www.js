#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('spock:server');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require("uuid-random")
var count = 0
/**
 * Get port from environment and store in Express.
 */
var messages = []
var clients = []
var port = normalizePort(process.env.PORT || '8090');
app.set('port', port);
var commands = {
  round : {
    name:'round',
    description:'Escolher em quantos rounds o jogo será executado.',
    command:'round'
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


io.on('connection', function(socket){
 console.log('a user connected');
 console.log('start new round')
 const roundDefault = 3
 var round = roundDefault
 var start = true
 var pause = false
 var autostart = true
 clients.push({cliente:socket.id,pontos:0})
 function commandExec(message){
  if (message.startsWith(prefix)){
    const commandBody = message.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
   if (command === "round") {
      const numArgs = args.map(x => x);
     round = parseInt(numArgs[0])
    }
    if (command === "start") {
     start = true
     io.emit('chat message','Partida iniciada por ' + socket.id)
    }
    if (command === "stop") {
      io.emit('chat message','Partida parada por ' + socket.id)
      start = false
     }

     if (command === "ponto") {
var pontos = 0
      clients.map(item=>
        {
          if(item.cliente == socket.id){
            pontos = item.pontos
          }
        })
      io.to(socket.id).emit('chat message','Pontos: ' + pontos)
      start = false
     }
     if (command === "auto") {
      io.emit('chat message','Modo de rounds automáticos definidos por ' + socket.id + ' status: ' + autostart)
      if(autostart){
        autostart = false
      }else{
        autostart = true
      }
     }
     if (command === "pausa") {
      io.emit('chat message','Jogo pausado por ' + socket.id + ' status: ' + autostart)
      if(autostart){
        pause = false
      }else{
        pause = true
      }
     
     }
    return true
  }else{
    return false
  }
  }

 io.to(socket.id).emit('chat message','Seu nome é ' + socket.id)
 clients.map(client=>{
  if(client.cliente != socket.id){
    console.log('testing...' + socket.id)
    console.log('testing...' + client.cliente)
    io.to(socket.id).emit('chat message','Você está jogando com ' + client.cliente)
  }
})

 if(count != 2){
  io.emit('chat message', 'Aguardando jogadores..');
  messages = []
}

count++
if(count == 2){  
  
  console.log(count)

  socket.on('chat message', function(msg){
    if(commandExec(msg)){
    
      console.log(socket.id + ' executou o comando ' + msg)
            return 
  }
  console.log('round:'+round)
  if(start){
    var lastmessage = messages[messages.length - 1]
    io.to(socket.id).emit('chat message','Você escolheu: ' +msg)
   if(lastmessage){
if(lastmessage.user != socket.id){
  console.log('compare users: ' + msg);
  var winner = checkWinner([socket.id,lastmessage.user],[obj[msg], obj[lastmessage.msg]])
if(winner.user){
  io.emit('chat message', winner.user +' Ganhou o round: ' + round)
     io.emit('chat message',winner.user + ' Ganhou 1 ponto! ' + ' Resultado: ' + winner.frase)
}
   clients.map(item=>
    {
      if(item.cliente == winner.user){
        item.pontos += 1
      }
    })
  
     round--
     
     
     if(round < 1 ){
      console.log(clients)
      io.emit('chat message', 'Round terminou.')
      io.emit('chat message', 'Vencedor:')
      clients.map(item=>
        {
          if(item.cliente == winner.user){
            io.emit('chat message', 'Vencedor:'+item.cliente + ' Pontos:' + item.pontos)
          }
        })
        if(autostart){
          round = roundDefault
          clients.map(item=>
            {
              item.pontos = 0
            })
        }else{
          io.emit('chat message', 'Inicie a partida com o comando /start')
        }

    }
   messages = []
}
   }
   messages.push({user:socket.id,msg})
  }
  });

}else if(count > 2){
  console.log(count)
  io.to(socket.id).emit('chat message','Limite de jogadores atingido. Aguarde um usuário desconectar')
}  

  socket.on('disconnect', function(){
    console.log('user disconnected');
    for(var i= 0; i< clients.length;i++){
      if(clients[i].cliente == socket.id){
        console.log('removing.. ' + clients[i])
        clients.splice(i,1)
       
      }
    }

    count--
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

  // handle specific listen errors with friendly messages
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
