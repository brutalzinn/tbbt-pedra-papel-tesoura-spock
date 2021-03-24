module.exports = {
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