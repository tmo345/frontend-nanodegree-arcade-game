var Enemy = require('./game/enemy.js'),
    GameStateManager = require('./game/gamestate.js'),
    Player = require('./game/player.js'),
    Score = require('./game/score.js'),
    GameTimer = require('./game/timer.js'),
    HighScores = require('./game/highscores.js');


// Instantiate objects.

var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();
var gameStateManager = new GameStateManager();
var timer = new GameTimer();
var score = new Score();
var highScores = new HighScores();


module.exports = {
    gameStateManager : gameStateManager,
    player: player,
    score: score,
    allEnemies: allEnemies,
    timer: timer,
    highScores: highScores
};

