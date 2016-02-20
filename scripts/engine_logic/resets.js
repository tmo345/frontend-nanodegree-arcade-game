var score = require('../game_objects/score');
var timer = require('../game_objects/timer');

// Reset timer and score at end of game

function resetGameInformation() {
    score.reset();
    timer.reset();
}

module.exports = {
    resetGameInformation: resetGameInformation,
};