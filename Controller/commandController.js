const prefix = "/";
var commands = require('../Models/commandObject')
var gameController = require('../Controller/gameController')
function commandExec(io,message,userid){
    if (message.startsWith(prefix)){
      const commandBody = message.slice(prefix.length);
      const args = commandBody.split(' ');
      const command = args.shift().toLowerCase();
     if(commands[command]){
  
      if (commands[command].command === 'username') {
        const numArgs = args.map(x => x);
  
       io.emit('chat message', `The user changed their username from  ${gameController.getUser(userid).username} to ${numArgs[0]}`)
       gameController.getUser(userid).username = numArgs[0]
      }
      if (commands[command].command === 'board') {
        gameController.clients.map(item=>
          {
            io.to(userid).emit('chat message',`Usuário:${item.username} Pontos:${item.pontos} `)
          })
      }
      if (commands[command].command === 'command') {
        for(var i in commands){
        io.to(userid).emit('chat message',{type:1,message:`<center><h1>/${commands[i].command} - ${commands[i].description}</h1> <br/>`})
        }
       }
      
     if (commands[command].command === 'round') {
        const numArgs = args.map(x => x);
       round = parseInt(numArgs[0])
       gameController.round = round
       gameController.resetGame()
       console.log('testeeeeee',gameController.clientMessage)
       io.emit('chat message', `Essa partida será definida em ${gameController.round } rounds`)

      
        
      }
      if (commands[command].command === 'scroll') {
        io.to(userid).emit('config','scroll')
        io.to(userid).emit('chat message','Setting auto scroll.')
      }
      if (commands[command].command === 'clear') {
        io.to(userid).emit('config','clear')
      }
      else if (commands[command].command === 'info') {
        var info = ' <center><h3>Digite uma opção abaixo na entrada para fazer uma jogada.</h3><h1>Regras</h1><br/><h2>tesoura corta papel<br/>papel cobre pedra<br/>pedra esmaga lagarto<br/>lagarto envenena Spock<br/>Spock esmaga tesoura<br/>tesoura decapita lagarto<br/>lagarto come o papel<br/>papel refuta Spock<br/>Spock vaporiza a pedra<br/>pedra esmaga tesoura</h2>'
        const numArgs = args.map(x => x);
       console.log('count',numArgs.length)
        if(numArgs.length >= 1){
          var commandinfo = numArgs[0]
            if(commands[commandinfo]){
              io.to(userid).emit('chat message',{message:`<h4>${commands[commandinfo].command}: ${commands[commandinfo].info ? commands[commandinfo].description + ' syntax: ' + commands[commandinfo].info : commands[commandinfo].description} </h4>`,type:1})
            }else{
              io.to(userid).emit('chat message',{type:1,message:`<h4>Cant find ${commandinfo}</h4>`})
            }
            }else{
          io.to(userid).emit('chat message',{type:1,message:info})
            }
      }
     else if (commands[command].command === "start") {
       io.emit('chat message','Partida iniciada por ' + userid)
       gameController.start = true
       gameController.resetGame()
      }
     else if (commands[command].command === "stop") {
        io.emit('chat message','Partida parada por ' + userid)
        start = false
       }
      else if (commands[command].command === "ponto") {
  var pontos = 0
        gameController.clients.map(item=>
          {
            if(item.id == userid){
              pontos = item.pontos
            }
          })
        io.to(userid).emit('chat message','Pontos: ' + pontos)
  
       }
      else if (commands[command].command === "auto") {
        io.emit('chat message','Modo de rounds automáticos definidos por ' + userid + ' status: ' + autostart)
        if(autostart){
          gameController.autostart = false
        }else{
          gameController.autostart = true
        }
       }
       else if (commands[command].command === "pause") {
        io.emit('chat message','Jogo pausado por ' + userid + ' status: ' + autostart)
        if(autostart){
          gameController.pause = false
        }else{
          gameController.pause = true
        }
      }
       }else{
        io.to(userid).emit('chat message','Cant recognize this command.')
       }
       return true
      }else{
        return false
      }
  }

  module.exports = {
    commandExec
  }