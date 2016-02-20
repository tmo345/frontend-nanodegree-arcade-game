var Enemy = require('./Enemy.js');
var Player = require('./Player.js');

var allEnemies,
    player;

allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}

player = new Player();

module.exports = {
   allEnemies: allEnemies,
   player: player
};

