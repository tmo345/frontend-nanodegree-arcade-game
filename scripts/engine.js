/* Dependencies
 */
var app = require('./app.js'),
    resources = require('./utilities/resources.js'),
    rendering = require('./enginefiles/rendering.js'),
    eventlisteners = require('./enginefiles/eventlisteners.js'),
    stateChecks = require('./enginefiles/statechecks.js'),
    updates = require('./enginefiles/updates.js');

/* Engine.js - Game engine with game loop
 */

    // Class Instances
var gameStateManager = app.gameStateManager,
    player = app.player,
    score = app.score,
    timer = app.timer,

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
    'images/char-boy.png'
]);

/* On loading of the images, build the start screen
 */

resources.onReady(buildStartScreen);


function buildStartScreen() {

    rendering.renderStartScreen();

    /* User can press enter key to start game.
     * listenerWrapper calls listener with init function as a parameter
     */
    pressEnterToStart.listenerWrapper(init);
    pressEnterToStart.turnOnEventListener();
}

/* Init is called by pressEnterToStart event listener.
 * Kicks off the main game loop after setting up the necessary elements
 */

function init() {
    // Change from startScreen to gamePlay state
    gameStateManager.toGamePlay();

    arrowsMovePlayer.turnOnEventListener();
    reset();
    timer.startTimer();
    lastTime = Date.now();
    main();
}

function reset() {
    score.reset();
    timer.reset();
}

/* This function serves as the kickoff point for the game loop itself
 * and handles properly calling the update and render methods.
 */
function main() {
    var currentGameState = gameStateManager.getCurrentState();

    if (currentGameState === 'endScreen') {
        return;
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


function elementStateChecks() {
    checkEnemyPlayerCollision();
    checkPlayerInWater();
    checkTimerForEnd();
}


function update(dt) {
    updateGameInformation();
    updateEntities(dt);
}


function render() {
    var gameState = gameStateManager.getCurrentState();

    rendering.renderGameGrid();
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