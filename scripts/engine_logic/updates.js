'use strict';

var entities = require('../game_objects/instantiate_entities');
var timer = require('../game_objects/timer');

var player = entities.player,
    allEnemies = entities.allEnemies;



// Perform updates on game element information based on changes since last frame
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