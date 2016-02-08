var player = require('../gameelements/player');


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

module.exports = {
    enterToStart: enterToStart,
    handleArrowKeysToMove: handleArrowKeysToMove
};