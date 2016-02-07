var app = require('../app.js');


function checkCollisions() {
    app.collisionHandler.checkEnemyPlayerCollision(app.allEnemies, app.player);
    app.collisionHandler.checkPlayerInWater(app.player);
}

function checkTimer() {
    if (app.gameTimer.isTimeUp() === true) {
        app.gameStateManager.toEndScreen();
    }
}

// function isGameOver() {
//     var gameState = app.gameStateManager.getCurrentState();
//     if (gameState === 'endScreen') {
//         return true;
//     } else {
//         return false;
//     }
// }