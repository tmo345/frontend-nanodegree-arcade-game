var score = require('../game_objects/score');
var timer = require('../game_objects/timer');
var entities = require('../game_objects/instantiate_entities');

// Reset timer and score at end of game

function resetEntities() {
    entities.allEnemies.forEach(function(enemy) {
        enemy.resetSprite();
    });
}

function resetGameInformation() {
    score.reset();
    timer.reset();
}

module.exports = {
    resetGameInformation: resetGameInformation,
};