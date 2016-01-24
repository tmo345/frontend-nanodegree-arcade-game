var Enemy = require('./classes/enemy.js'),
    Player = require('./classes/player.js'),
    gameStateManager = require('./gamedata/gamestate.js'),
    score = require('./gamedata/score.js'),
    gameTimer = require('./gamedata/gametimer.js'),
    highScores = require('./gamedata/highscores.js');

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

