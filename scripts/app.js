/* Game objects are instantiated if needed and all passed as an app module to engine.js and enginefiles
 */

var Enemy = require('./appfiles/enemy.js');
var Player = require('./appfiles/player.js');
var gameState = require('./appfiles/gamestate.js');
var score = require('./appfiles/score.js');
var gameTimer = require('./appfiles/gametimer.js');
var highScores = require('./appfiles/highscores.js');
var collisionHandler = require('./appfiles/collisionhandler.js');
var EventHandler = require('./appfiles/eventhandler.js');
var listeners = require('./appfiles/listeners.js');

// Instantiate objects.
var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}

var player = new Player(),
    pressEnterToStart = new EventHandler('keyup', listeners.enterToStart),
    arrowsMovePlayer = new EventHandler('keyup', listeners.handleArrowKeysToMove);


module.exports = {
    gameState: gameState,
    player: player,
    score: score,
    allEnemies: allEnemies,
    gameTimer: gameTimer,
    highScores: highScores,
    collisionHandler: collisionHandler,
    listeners: listeners,
    pressEnterToStart: pressEnterToStart,
    arrowsMovePlayer: arrowsMovePlayer
};

