/* Dependencies
 */
var ctrl = require('./engine_logic/handlers');
var resources = require('./utilities/resources');
var render = require('./engine_logic/render');
var stateChecks = require('./engine_logic/state_checks');
var subscriptions = require('./engine_logic/subscriptions');
var entities = require('./game_objects/instantiate_entities');
var score = require('./game_objects/score');
var gameStateHandler = require('./state_handling/gamestate_handler');
var statePubSub = require('./state_handling/state_pubsub');
var highScores = require('./game_objects/high_scores');
var eventListeners = require('./state_handling/event_listeners');


/* Predefine necessary game element objects as variables in this scope for
 * convenience
 */
var allEnemies = entities.allEnemies,
    player = entities.player,
    lastTime;
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

/* Set up eventlistener callbacks
 * press enter: init
 * press arrows: player.handleInput
 */
eventListeners.pressEnterToStart.setListenerCallback(init);
eventListeners.arrowsMovePlayer.setListenerCallback(player.handleInput.bind(player));

/* Set the event listeners on/off statuses for current game state (startScreen now)
 * See comments in function in handlers.js
 */
// ctrl.pressEnterToStart.turnOnEventListener();

subscriptions.setStateSubscriptions();

/* Game loop is initiated when the pressEnterToStart event listener calls init
 * Init includes the first call to main to start the loop
 */
function main(ctx) {
    // Start game loop by checking to see if we are in the game over state
    // if (ctrl.isGameOver()) {

    //     ctrl.toggleEventListeners();
    //     // Check to see if high score has not been set for game
    //     if (! ctrl.highScoreHasBeenSet() ) {
    //         // If not set, access localStorage to update high scores
    //         ctrl.setHighScoreForGame();
    //         // and then render them in the DOM next to canvas
    //         render.renderHighScores(ctx);
    //     }
    // }


    /* Time delta information needed for smooth animation
     */
    var now = Date.now(),
        dt = (now - lastTime) / 1000.0;


    stateChangeHandling();
    update(dt, statePubSub);
    rendering();
    // cleanUp();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    window.requestAnimationFrame(main);
}

/* Builds the initial start screen on page load
 */
function buildStartScreen(ctx) {
    gameStateHandler.toStartScreen(statePubSub);

    highScores.render();
    render.renderGameGrid(ctx);
    render.renderStartScreen(ctx);

}

/* This function does some initial setup that should only occur once,
 * particularly setting the lastTime variable that is required for the
 * game loop.
 */
function init() {

    gameStateHandler.toGamePlay(statePubSub);
    // ctrl.toggleEventListeners();
    // ctrl.arrowsMovePlayer.turnOnEventListener();
    // ctrl.pressEnterToStart.turnOffEventListener();
    reset();
    lastTime = Date.now();

    // Start the game loop
    main();
}

/* IMPORTANT: update game information must be called first in the
 * update function or score increases and decreases will not work!
 * Ex:
 * Collision handler is called during stateChangeHandling and detects
 * player is in water (y < landmarks.boundaries.top)
 * Player in water status is set to on
 * Update game information is called. Score checks to see if player is
 * is in water. It sees player in water so scoreChange is called to
 * increase score.
 * Update entities is called, which detects player in water and resets
 * the sprite, which resets the position and sets inTheWater to false
 *
 * If update entities is called first, it resets the player and the in
 * water status prior to score being able to check for player being in
 * water. Score sees player as not being water so does not call scoreChange
 */
function update(dt) {
    ctrl.updateEntities(dt, statePubSub);
    ctrl.updateGameInformation(statePubSub);


}

function stateChangeHandling() {
    stateChecks.checkTimer();
    stateChecks.checkCollisions();
}

function rendering(ctx) {
    render.renderGameGrid(ctx);
    render.renderEntities();
    render.renderGameInformation();
    // If game is over, will continue render grid, entities, and information,
    // but the end screen information will overlay it
    if (stateChecks.isGameOver() === true) {
        render.renderGameOverScreen(ctx);
    }
}


// Reset score and timer
// Called once on init
function reset() {
    ctrl.resetGameInformation();
}