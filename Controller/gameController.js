
var clientMessage = []
var clients = []
var round = 1
var roundCount = 1
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
    }


    module.exports = {
        resetGame,
        start,
        pause,
        autostart,
        round,
        roundCount,
        clients,
        clientMessage
    }
