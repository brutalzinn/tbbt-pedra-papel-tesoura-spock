const prefix = "/";
var commands = require('../Models/commandObject')
var gameController = require('../Controller/gameController')
function commandExec(io,message,socket){
    if (message.startsWith(prefix)){
      const commandBody = message.slice(prefix.length);
      const args = commandBody.split(' ');
      const command = args.shift().toLowerCase();
     if(commands[command]){
  
      if (commands[command].command === 'username') {
        const numArgs = args.map(x => x);
  
       io.emit('chat message', `The user changed their username from  ${gameController.getUser(socket.id).username} to ${numArgs[0]}`)
       gameController.getUser(socket.id).username = numArgs[0]
      }

      if (commands[command].command === 'message') {
        const numArgs = args.map(x => x);
        var message = ''
        var start = 0
        if(numArgs[0] == 'g'){
          console.log('this message is for all channels.')
           start = 1
        }else{
         start = 0
        }
        for(var i=start ;i < numArgs.length;i++){
          message += numArgs[i] + ' '
        }   
  if(start == 0){
    io.to(gameController.getUser(socket.id).channel).emit('chat message', `${gameController.getUser(socket.id).username}: ${message}`)
  }else{
    io.emit('chat message', `[GLOBAL]${gameController.getUser(socket.id).username}: ${message}`)
  }
      }
      if (commands[command].command === 'board') {
        gameController.clients.map(item=>
          {
            if(item.channel == gameController.getUser(socket.id).channel){
              io.to(socket.id).emit('chat message',`Usuário:${item.username} Pontos:${item.pontos} `)

            }
          })
      }
      if (commands[command].command === 'command') {
        for(var i in commands){
        io.to(socket.id).emit('chat message',{type:1,message:`<center><h1>/${commands[i].command} - ${commands[i].description}</h1> <br/>`})
        }
       }
       if (commands[command].command === 'channel') {
        const numArgs = args.map(x => x);
        
        if(numArgs.length >= 1){
     //     gameController.getChannel(gameController.getUser(socket.id).channel).channel = numArgs[0]
   var result = false
     gameController.clients.map(item=>
      {
        if(item.id != socket.id && item.channel == gameController.getUser(socket.id).channel){
          result = true
        }
      })
      if(!result){
        gameController.deleteChannel(gameController.getUser(socket.id).channel)
      }
     
     gameController.getUser(socket.id).channel = numArgs[0]
        if(!gameController.getChannel( gameController.getUser(socket.id).channel)){
          gameController.channels.push({channel:gameController.getUser(socket.id).channel,round:1,roundcount:1,pause:false,start:true,autostart:true})
        }
          io.to(socket.id).emit('chat message','Change channel to..' + numArgs[0] )
        }else{
          io.to(socket.id).emit('chat message','You are on channel... ' + gameController.getUser(socket.id).channel)
        }
        socket.join(gameController.getUser(socket.id).channel)

      console.log( 'channel',gameController.channels)
       console.log( 'clients',gameController.clients)

       }
      
     if (commands[command].command === 'round') {
        const numArgs = args.map(x => x);
     
       if(numArgs.length >= 1){
        round = parseInt(numArgs[0])
       gameController.getChannel(gameController.getUser(socket.id).channel).round = round
      
       gameController.resetGame(gameController.getUser(socket.id).channel)
      }
       io.to(gameController.getUser(socket.id).channel).emit('chat message', `Essa partida será definida em ${gameController.getChannel(gameController.getUser(socket.id).channel).round} rounds`)  
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
        const numArgs = args.map(x => x);
       console.log('count',numArgs.length)
        if(numArgs.length >= 1){
          var commandinfo = numArgs[0]
            if(commands[commandinfo]){
              io.to(socket.id).emit('chat message',{message:`<h4>${commands[commandinfo].command}: ${commands[commandinfo].info ? commands[commandinfo].description + ' syntax: ' + commands[commandinfo].info : commands[commandinfo].description} </h4>`,type:1})
            }else{
              io.to(socket.id).emit('chat message',{type:1,message:`<h4>Cant find ${commandinfo}</h4>`})
            }
            }else{
          io.to(socket.id).emit('chat message',{type:1,message:info})
            }
      }
     else if (commands[command].command === "start") {
    
       gameController.getChannel(gameController.getUser(socket.id).channel).start = true
       console.log('changes channel to',gameController.getUser(socket.id).channel)
       gameController.resetGame(gameController.getUser(socket.id).channel)
       io.to(gameController.getUser(socket.id).channel).emit('chat message','Partida iniciada por ' + socket.id)
console.log('sendingg to channel' ,gameController.getUser(socket.id).channel )
       console.log( 'channel',gameController.channels)
       console.log( 'clients',gameController.clients)
      }
     else if (commands[command].command === "stop") {
      gameController.getChannel(gameController.getUser(socket.id).channel).start = false
      io.to(gameController.getUser(socket.id).channel).emit('chat message','Partida parada por ' + socket.id)
       }
      else if (commands[command].command === "ponto") {
  var pontos = 0
        gameController.clients.map(item=>
          {
            if(item.id == socket.id && item.channel == gameController.getUser(socket.id).channel){
              pontos = item.pontos
            }
          })
        io.to(userid).emit('chat message','Pontos: ' + pontos)
  
       }
      else if (commands[command].command === "auto") {
        io.to(gameController.getUser(socket.id).channel).emit('chat message','Modo de rounds automáticos definidos por ' + socket.id + ' status: ' + autostart)
        if(gameController.getChannel(gameController.getUser(socket.id).channel).autostart){
          gameController.getChannel(gameController.getUser(socket.id).channel).autostart = false
        }else{
          gameController.getChannel(gameController.getUser(socket.id).channel).autostart = true
        }
       }
       else if (commands[command].command === "pause") {
        io.to(gameController.getUser(socket.id).channel).emit('chat message','Jogo pausado por ' + socket.id + ' status: ' + io.to(gameController.getUser(socket.id).channel).pause)
     
        if(gameController.getChannel(gameController.getUser(socket.id).channel).pause){
          gameController.getChannel(gameController.getUser(socket.id).channel).pause = false
        }else{
          gameController.getChannel(gameController.getUser(socket.id).channel).pause = true
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

  module.exports = {
    commandExec
  }