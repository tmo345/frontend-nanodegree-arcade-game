var Enemy = require('./game/enemy.js'),
    GameStateManager = require('./game/gamestate.js'),
    Player = require('./game/player.js'),
    Score = require('./game/score.js'),
    GameTimer = require('./game/timer.js');


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var gameStateManager = new GameStateManager();
var timer = new GameTimer();
var score = new Score();
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();


module.exports = {
    gameStateManager : gameStateManager,
    player: player,
    score: score,
    allEnemies: allEnemies,
    timer: timer,
};
