'use strict';

/** Instantiate player and 3 enemies (enemy instances are put into allEnemies array)
 *
 *  Exports:
 *      allEnemies: array of enemy instances
 *      player: player instance
 */

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

