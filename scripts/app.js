/* Game objects are instantiated if needed and all passed as an app module to engine.js and enginefiles
 */

var Enemy = require('./classes/enemy.js'),
    Player = require('./classes/player.js'),
    gameStateManager = require('./appfiles/gamestate.js'),
    score = require('./appfiles/score.js'),
    gameTimer = require('./appfiles/gametimer.js'),
    highScores = require('./appfiles/highscores.js');

// Instantiate objects.
var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();


module.exports = {
    gameStateManager : gameStateManager,
    player: player,
    score: score,
    allEnemies: allEnemies,
    gameTimer: gameTimer,
    highScores: highScores
};

