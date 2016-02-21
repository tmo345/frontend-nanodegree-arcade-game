'use strict';

/** State checks used in engine.js for collisions, player reaching water, timer
 *  states, and game state
 *
 *  Exported methods:
 *      checkCollisions:
 *          Detect player/enemy collisions and publishes to statePubSub
 *          Detect player reaching water and publishes to statePubSub
 *      checkTimer:
 *          Checks if time is up and publishes to statePubSub
*           Check for timer running low (see timer.render method - text turns
*           red when time is running out)
 *      isGameOver:
 *          Used in engine.js in rendering function to determine if game over
 *          screen should be rendered on top of each frame.
 */

var statePubSub = require('../state_handling/state_pubsub');
var collisionHandler = require('../state_handling/collision_handler');
var timer = require('../game_objects/timer');
var gameStateHandler = require('../state_handling/gamestate_handler');
var entities = require('../game_objects/instantiate_entities');

var player = entities.player,
    allEnemies = entities.allEnemies;


function checkCollisions() {
    collisionHandler.collisionCheck(allEnemies, player, statePubSub);
}

function checkTimer() {
    timer.checkForTimeUp(statePubSub);
    timer.checkForTimeRunningOut();
}

// Everything except the conditional rendering of the game over screen in game
// uses the statePubSub to monitor game state. The reason for not using a subscription
// is that the rendering of the end screen data occurs every loop over an actively
// rendering grid with enemies moving across it. It needs to be called more than the one time
// when the game state changes to game over.
function isGameOver() {
    if (gameStateHandler.getCurrentState() === 'gameOver') {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    checkCollisions: checkCollisions,
    checkTimer: checkTimer,
    isGameOver: isGameOver
};