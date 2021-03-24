
var clientMessage = []
var clients = []
var round = 1
var roundCount = 1
function resetGame(){
    clients.map(item=>
      {
        item.pontos = 0
      })
      roundCount = 1
      clientMessage = []
      console.log('reseting all..',roundCount,round)
    }


    module.exports = {
        resetGame,
        round,
        roundCount,
        clients,
        clientMessage
    }
