var EventHandler = require('../classes/eventhandler.js');

// Game event listeners needed for each instantiation of EventHandler
function enterToStart(callback) {
    if (window.event.keyCode === 13) {
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
    arrowsMovePlayer = new EventHandler('keyup', handleArrowKeysToMove);

module.exports = {
    pressEnterToStart: pressEnterToStart,
    arrowsMovePlayer: arrowsMovePlayer
};