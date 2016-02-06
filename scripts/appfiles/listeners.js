
// Game event listeners needed
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



module.exports = {
    enterToStart: enterToStart,
    handleArrowKeysToMove: handleArrowKeysToMove
};