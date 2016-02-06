var app = require('./app.js');
var resources = require('./utilities/resources.js');
var rendering = require('./enginefiles/rendering.js');
var updates = require('./enginefiles/updates.js');
var canvas = require('./appfiles/canvas.js');
// var engine = require('./enginefiles/engine.js');
// var eventHelper = require('./utilities/eventhelper.js');


var lastTime;


/* Load entity and image assets
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


function buildStartScreen() {
    app.gameState.toStartScreen();

    rendering.renderHighScores();
    rendering.renderGameGrid(canvas.ctx);
    rendering.renderStartScreen(canvas.ctx);

    // Set callbacks for event listeners
    setListenerWrappers();
    // Toggles an event listener that will call init() on "enter" pressing
    toggleEventListeners();
}

/* Init is called by pressEnterToStart event listener.
 * Kicks off the main game loop after setting up the necessary elements
 */

function init() {
    // Set game state to gameplay
    app.gameState.toGamePlay();

    toggleEventListeners();
    // reset score, timer, and high score called status (so it can be set if a new
    // high score is achieved this game)
    reset();

    // will be used to determine time change between frames
    lastTime = Date.now();

    // Start the game loop
    main();
}

function reset() {
    // reset high score called status so a high score can be recalculated and rendered
    // at end of game
    app.highScores.resetCalledStatus();

    app.score.reset();
    app.gameTimer.reset();
}

/* This function serves as the kickoff point for the game loop itself
 * and handles properly calling the update and render methods.
 */
function main() {
    // Check for gameState === endScreen
    // If true, reset player position
    // Turn off arrowsMovePlayer eventlistener
    if (isGameOver()) {
        app.player.resetSprite();
        toggleEventListeners();
        setHighScoreForGame();
    }

    var now = Date.now(),
        dt = (now - lastTime) / 1000.0;


    handleStateChange();
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
    var gameState = app.gameState.getCurrentState();
    if (gameState === 'endScreen') {
        return true;
    } else {
        return false;
    }
}

function handleStateChange() {
    app.collisionHandler.checkEnemyPlayerCollision(app.allEnemies, app.player);
    app.collisionHandler.checkPlayerInWater(app.player);
    if (app.gameTimer.isTimeUp() === true) {
        app.gameState.toEndScreen();
    };
}


function update(dt) {
    updates.updateGameInformation();
    updates.updateEntities(dt);
}


function render() {

    rendering.renderGameGrid(canvas.ctx);
    rendering.renderEntities();
    rendering.renderGameInformation();

    if (isGameOver()) {
        rendering.renderEndScreen(canvas.ctx);
    }
}



function cleanUp() {
    // Set collision statuses to false if needed
    if (app.player.getInWaterStatus() === true) {
        app.player.togglePlayerInWaterStatus();
    } else if (app.player.getCollisionStatus() === true) {
        app.player.toggleCollisionStatus();
    }

}

function setListenerWrappers() {
    // Set callbacks for event listeners
    app.pressEnterToStart.listenerWrapper(init);

    // Use bind to set 'this' to player. Otherwise
    // addEventListener will change 'this' to window
    app.arrowsMovePlayer.listenerWrapper(app.player.handleInput.bind(app.player));
}

function toggleEventListeners() {
    var gameState = app.gameState.getCurrentState(),
        arrowListenerState = app.arrowsMovePlayer.reportOnOffState(),
        enterListenerState = app.pressEnterToStart.reportOnOffState();

    // Only want to toggle the listeners if in correct game state and
    // have not yet turned the appropriate listener on
    if ((gameState === 'gamePlay') && (arrowListenerState === 'off')) {
        app.pressEnterToStart.turnOffEventListener();
        app.arrowsMovePlayer.turnOnEventListener();
    } else if ((gameState === 'startScreen' || gameState === 'endScreen') &&
                enterListenerState === 'off') {
        app.pressEnterToStart.turnOnEventListener();
        app.arrowsMovePlayer.turnOffEventListener();
    }

}

// Expect score obejct with currentScore attribute
function setHighScoreForGame(score) {
    if (! app.highScores.hasBeenCalledForGame) {
            app.highScores.pullFromStorage();
            app.highScores.updateHighScore(score.currentScore);
            app.highScores.pushToStorage();
            rendering.renderHighScores();
            app.highScores.calledOnceForThisGame();
        }
}