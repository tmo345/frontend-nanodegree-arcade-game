/* Game objects are instantiated if needed and all passed as an app module to engine.js and enginefiles
 */

var Enemy = require('./gameelements/enemy.js');
var Player = require('./gameelements/player.js');
var score = require('./gameelements/score.js');
var gameTimer = require('./gameelements/gametimer.js');
var highScores = require('./gameelements/highscores.js');

// Instantiate objects.
var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}

var player = new Player();


module.exports = {
    player: player,
    score: score,
    allEnemies: allEnemies,
    gameTimer: gameTimer,
    highScores: highScores
};

