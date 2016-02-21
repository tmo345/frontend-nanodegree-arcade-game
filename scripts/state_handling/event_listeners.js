'use strict';

/** Event listeners module - instantiate Event Handler objects with listener functions
 *      in module. An eventListenerToggle function turns the event listeners on and off
 *      depending on the gameState.
 *
 * Exports:
 *      pressEnterToStart: Event Handler object with eventlistenr for enter key press
 *      arrowsMovePlayer: Event Handler object with eventlistner for arrow keys
 *      subscribeToGameStateStatus: set subscription to gameState
 *
 * Subscriptions + subsciber function:
 *      gameState: eventListenerToggle
 *
 */

var EventHandler = require('../state_handling/Event_handler');

var pressEnterToStart,
    arrowsMovePlayer;

// Will receive the game loop function init as the argument in engine.js
function enterToStart(callback) {
    if (window.event.keyCode === 13) {
        callback();
    }
}

// Listen for arrow key presses and pass to player method handleInput
function handleArrowKeysToMove(callback) {
    var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

    callback(allowedKeys[window.event.keyCode]);
}

// Instantiate event listeners with appropriate event type and listener
pressEnterToStart = new EventHandler('keyup', enterToStart);
arrowsMovePlayer = new EventHandler('keyup', handleArrowKeysToMove);


function eventListenerToggle(currentGameState) {
    if (currentGameState === 'gamePlay') {
        pressEnterToStart.turnOffEventListener();
        arrowsMovePlayer.turnOnEventListener();
    } else if (currentGameState === 'startScreen' || currentGameState === 'gameOver') {
        pressEnterToStart.turnOnEventListener();
        arrowsMovePlayer.turnOffEventListener();
    }
}

function subscribeToGameStateStatus(statePubSub) {
    statePubSub.subscribe('gameStateChange', eventListenerToggle);
}

module.exports = {
    pressEnterToStart: pressEnterToStart,
    arrowsMovePlayer: arrowsMovePlayer,
    subscribeToGameStateStatus: subscribeToGameStateStatus
};