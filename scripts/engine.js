/* Dependencies
 */
var app = require('./app.js'),
    resources = require('./utilities/resources.js'),
    rendering = require('./enginefiles/rendering.js'),
    eventlisteners = require('./enginefiles/eventlisteners.js'),
    stateChecks = require('./enginefiles/collisionhandler.js'),
    updates = require('./enginefiles/updates.js'),
    canvas = require('./gamedata/canvas.js');

/* Engine.js - Game engine with game loop
 */


    // Class Instances
var gameStateManager = app.gameStateManager,
    player = app.player,
    score = app.score,
    gameTimer = app.gameTimer,
    highScores = app.highScores,
    gem = app.gem,
    ctx = canvas.ctx,
    allEnemies = app.allEnemies,

    // Event Listeners
    arrowsMovePlayer = eventlisteners.arrowsMovePlayer,
    pressEnterToStart = eventlisteners.pressEnterToStart,

    // Element State Checks
    checkEnemyPlayerCollision = stateChecks.checkEnemyPlayerCollision,
    checkPlayerInWater = stateChecks.checkPlayerInWater,
    checkTimerForEnd = stateChecks.checkTimerForEnd,

    // Element Updates
    updateEntities = updates.updateEntities,
    updateGameInformation = updates.updateGameInformation,

    // Game loop
    lastTime;



/* Load grid image assets
*/

resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
]);

/* On loading of the images, build the start screen
 */

resources.onReady(buildStartScreen);

/* Set callbacks for event listeners
 */
pressEnterToStart.listenerWrapper(init);
// Use bind to set 'this' to player. Otherwise
// addEventListener will change 'this' to window
arrowsMovePlayer.listenerWrapper(player.handleInput.bind(player));


function buildStartScreen() {
    gameStateManager.toStartScreen();
    rendering.renderHighScores();
    rendering.renderStartScreen();
    pressEnterToStart.turnOnEventListener();

}

/* Init is called by pressEnterToStart event listener.
 * Kicks off the main game loop after setting up the necessary elements
 */

function init() {
    // Change from startScreen to gamePlay state
    gameStateManager.toGamePlay();
    pressEnterToStart.turnOffEventListener();
    arrowsMovePlayer.turnOnEventListener();
    highScores.resetCalledStatus();
    reset();
    lastTime = Date.now();
    main();
}

function reset() {
    score.reset();
    gameTimer.reset();
}

/* This function serves as the kickoff point for the game loop itself
 * and handles properly calling the update and render methods.
 */
function main() {
    // Check for gameState === endScreen
    // If true, reset player position
    // Turn off arrowsMovePlayer eventlistener
    if (isGameOver()) {
        player.resetSprite();
        arrowsMovePlayer.turnOffEventListener();
        pressEnterToStart.turnOnEventListener();
        if (! highScores.calledForThisGame) {
            highScores.pullFromStorage();
            highScores.updateHighScore(score.currentScore);
            highScores.pushToStorage();
            rendering.renderHighScores();
            highScores.calledOnceForThisGame();
        }
    }

    var now = Date.now(),
        dt = (now - lastTime) / 1000.0;

    elementStateChecks();
    update(dt);
    render();
    cleanUp();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    window.requestAnimationFrame(main);
}

function isGameOver() {
    var gameState = gameStateManager.getCurrentState();
    if (gameState === 'endScreen') {
        return true;
    } else {
        return false;
    }
}

function elementStateChecks() {
    checkEnemyPlayerCollision(allEnemies, player);
    checkPlayerInWater(player);
    if (gameTimer.checkTimerForEnd() === true) {
        gameStateManager.toEndScreen();
    }
}

function update(dt) {
    updateGameInformation();
    updateEntities(dt);
}


function render() {
    var gameState = gameStateManager.getCurrentState();

    rendering.renderGameGrid();
    // rendering.renderGem();
    rendering.renderEntities();
    rendering.renderGameInformation();

    if (gameState === 'endScreen') {
        rendering.renderEndScreen();
    }
}



function cleanUp() {
    // Set collision statuses to false if needed
    if (player.getInWaterStatus() === true) {
        player.togglePlayerInWaterStatus();
    } else if (player.getCollisionStatus() === true) {
        player.toggleCollisionStatus();
    }

}
