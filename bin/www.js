#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('spock:server');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var commandExec = require('../Controller/commandController')
var gameObject = require('../Models/gameObject')
var gameController = require('../Controller/gameController')
var port = normalizePort(process.env.PORT || '80');
app.set('port', port);

io.on('connection', function(socket){
  //game variables for each game; session

 gameController.clients.push({id:socket.id,pontos:0,username:socket.id})
 gameController.userWelcome(socket.id,io)
 // all channels and commands are handled here
  socket.on('chat message', function(msg){
    if(commandExec.commandExec(io,msg,socket.id)){
      console.log(socket.id + ' executou o comando ' + msg)
  return 
  }
  //check if has two users..
  if(gameController.clients.length == 2){  

  if(gameController.start && !gameController.pause){
    var lastmessage = gameController.clientMessage[gameController.clientMessage.length - 1]
    if(!gameObject[msg.toLowerCase()]){
    
      io.to(socket.id).emit('chat message','Essa opção não existe: ' +msg)
return 
    }
    io.to(socket.id).emit('chat message','Você escolheu: ' +msg)
   if(lastmessage){
if(lastmessage.user != socket.id){
  var winner = gameController.checkWinner([socket.id,lastmessage.user],[gameObject[msg.toLowerCase()], gameObject[lastmessage.msg.toLowerCase()]])
  if(winner){
       io.emit('info',`<center>ROUND ${gameController.roundCount} - ${gameController.getUser(winner.user).username} Ganhou 1 ponto! - ${winner.frase}</center>`)
       gameController.clientMessage = []
  }else{
    io.emit('info',`<center>ROUND ${gameController.roundCount} - Empate!</center>`)
    gameController.clientMessage = []
  }
  gameController.clients.map(item=>
    {
      if(item.id == winner.user){
        item.pontos += 1
        console.log(gameController.getUser(winner.user).username)
      }
    })
    console.log('pre finishing round...  ',gameController.round)
  if(gameController.roundCount >= gameController.round){
 io.emit('info', `<center>${gameController.round > 1 ? gameController.round+' round': gameController.round + ' rounds'}</center>`)
  io.emit('info', '<center><h1>Result</h1></center>')
  var max = 0
  var winner = []
  for(var i = 0; i < gameController.clients.length;i++) 
     {
 if(gameController.clients[i].pontos > max){
  winner = gameController.clients[i]
  // io.emit('info', {message:`<h2><center>Vencedor: ${gameController.clients[i].username} Pontos: ${gameController.clients[i].pontos}</center></h2>`,time:5000})
} 
}
if(Array.isArray(winner) && winner.length == 0){
  io.emit('info', {message:`<h2><center>Empate!</center></h2>`,time:20000})
}else{
  io.emit('info', {message:`<h2><center>Vencedor: ${winner.username} Pontos: ${winner.pontos}</center></h2>`,time:20000})
}
io.emit('info', '<center><h4>Point board</h4></center>')
for(var i = 0; i < gameController.clients.length;i++) 
{
 io.emit('info', {message:`<h2><center>${gameController.clients[i].username} Pontos: ${gameController.clients[i].pontos}</center></h2>`,time:20000})
}
     if(gameController.autostart){
      gameController.resetGame()
      io.emit('chat message', `Round reiniciado! ${gameController.round > 1 ? gameController.round+' round': gameController.round + ' rounds'} `)
     }else{
       io.emit('chat message', 'Inicie a partida com o comando /start')
     }
     return 
 }
    gameController.roundCount++

 }
}
 for(var i=0;i < gameController.clientMessage.length;i++){
  if(gameController.clientMessage[i].user.includes(socket.id)){
    gameController.clientMessage.splice(i,1)
  }
 }
  gameController.clientMessage.push({user:socket.id,msg})   
  }
}else if(gameController.clients.length >= 2){
  io.to(socket.id).emit('chat message','Many users in the game. Wait for a free space.')
} 
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    for(var i= 0; i< gameController.clients.length;i++){
      if(gameController.clients[i].id == socket.id){
        console.log('removing.. ' + gameController.clients[i].username)
        io.emit('chat message', `The user ${gameController.clients[i].username} left the game.`)
        gameController.clients.splice(i,1)
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

  // handle specific listen errors with friendly gameController.clientMessage
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
