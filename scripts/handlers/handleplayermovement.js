var landmarks = require('../utilties/landmarks');

function handlePlayerMovement(keyCode, player) {
    var oneTileX = 101;
    var oneTileY = 83;

    if (keyCode === 'left') {
        if (player.x > landmarks.boundaries.left) {
            player.x -= oneTileX;
        }
    } else if (keyCode === 'right') {
        if (player.x < landmarks.boundaries.right) {
            player.x += oneTileX;
        }
    } else if (keyCode === 'up') {
            player.y -= oneTileY;
    } else if (keyCode === 'down') {
        if (player.y < landmarks.boundaries.bottom) {
            player.y += oneTileY;
        }

    }
}


module.exports = handlePlayerMovement;