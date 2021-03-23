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
function EffectSpeech(array){
  return usuarios[0] + ' Ganhou! ' + array[0].frase[array[1].name]
  return usuarios[1] + ' Ganhou! ' + array[1].frase[array[0].name]
}
  function checkWinner(usuarios,array) {    
    
    if(array[0].counter.includes(array[1].name)){
       return {user:usuarios[0],frase:array[0].frase[array[1].name]}
     }else if(array[1].counter.includes(array[0].name)){
      return {user:usuarios[1],frase:array[1].frase[array[1].name]}
     }else{
      return {user:0}
     }
  }


io.on('connection', function(socket){
 console.log('a user connected');
 console.log('start new round')
 clients.push(socket.id)
 io.to(socket.id).emit('chat message','Seu nome é ' + socket.id)
 clients.map(client=>{
  if(client != socket.id){
    console.log('testing...' + socket.id)
    console.log('testing...' + client)
    io.to(socket.id).emit('chat message','Você está jogando com ' + client)
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
    var regex = /msg/
    var match = regex.exec(msg);
console.log('####test'+ msg)
console.log('####match' + match[1])
    if(commands[match[1]]){
console.log(match[1] + ' é um comando')
      console.log(match[1]);  
    }
    

    var lastmessage = messages[messages.length - 1]
    io.to(socket.id).emit('chat message','Você escolheu: ' +msg)
   if(lastmessage){
if(lastmessage.user != socket.id){
  console.log('compare users: ' + msg);
  var winner = checkWinner([socket.id,lastmessage.user],[obj[msg], obj[lastmessage.msg]])
     io.emit('chat message',winner.user + 'Ganhou 1 ponto! ' + ' Resultado: ' + winner.frase)
   messages = []
}
   }
   messages.push({user:socket.id,msg})

  });
}else if(count > 2){
  console.log(count)
  io.to(socket.id).emit('chat message','Limite de jogadores atingido. Aguarde um usuário desconectar')
}  
  socket.on('disconnect', function(){
    console.log('user disconnected');
    for(var i= 0; i< clients.length;i++){
      if(clients[i] == socket.id){
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
