'use strict';

/** Update functions used in engine.js each run of game loop
 *
 *  Exports:
 *      updateEntities: update location of enemies and player
 *      updateGameInformation: update timer
 *      (score is not updated here as it is handled in responses to published
 *      collisions and player reaching water)
 */


var entities = require('../game_objects/instantiate_entities');
var timer = require('../game_objects/timer');

var player = entities.player,
    allEnemies = entities.allEnemies;



function updateEntities(dt, statePubSub) {
    allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    player.update(statePubSub);
}

function updateGameInformation() {
    timer.update();
}

module.exports = {
    updateEntities: updateEntities,
    updateGameInformation: updateGameInformation
};