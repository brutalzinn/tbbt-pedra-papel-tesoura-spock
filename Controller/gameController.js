
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
        resetGame
    }
