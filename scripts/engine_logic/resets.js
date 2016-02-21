'use strict';

/** Used in init function of engine.js to reset elements back to defaults
 *
 *  Exports:
 *      resetEntities: reset the enemies to offscreen with new random y tile
 *          start and speed
 *      resetGameInformation: reset the score to 0 and time back to the time
 *          limit set in timer.js
 */


var score = require('../game_objects/score');
var timer = require('../game_objects/timer');
var entities = require('../game_objects/instantiate_entities');


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
    resetEntities: resetEntities
};