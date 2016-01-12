var EventHandler = require('../utilities/eventhandler.js');

// Game Event Handlers
function enterToStart(callback) {
    if (window.event.keyCode === 13) {
        callback();
    }
}

function spacebarForNewGame(callback) {
    if (window.event.keycode === 32) {
        callback();
    }
}

function handleArrowKeysToMove(callback) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    callback(allowedKeys[window.event.keyCode]);
}

var pressEnterToStart = new EventHandler('keyup', enterToStart),
    pressSpacebarToRestart = new EventHandler('keyup', spacebarForNewGame),
    arrowsMovePlayer = new EventHandler('keyup', handleArrowKeysToMove);

module.exports = {
    pressEnterToStart: pressEnterToStart,
    pressSpacebarToRestart: pressSpacebarToRestart,
    arrowsMovePlayer: arrowsMovePlayer
};