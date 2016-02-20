var EventHandler = require('../state_handling/event_handler');

// Event Listener Functions

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
var pressEnterToStart = new EventHandler('keyup', enterToStart),
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