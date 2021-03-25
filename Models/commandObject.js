module.exports = {
    round : {
      name:'round',
      description:'Choose how much rounds will played.',
      info: '/round < number >',
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
      description:'Show info about the game and info for especify command.',
      info: '/info <command>',
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
    },
    channel:{
      name:'channel',
      description:'Show channel info and changes the channel.',
      info: '<br> /channel <channelname> to changes the channel <br> /channel to show info about this channel',
      command:'channel'
    }
  }