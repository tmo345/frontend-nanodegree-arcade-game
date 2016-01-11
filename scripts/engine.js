var app = require('./app.js'),
    resources = require('./utilities/resources.js'),
    rendering = require('./enginefiles/rendering.js'),
    eventlisteners = require('./enginefiles/eventlisteners.js'),
    stateChecks = require('./enginefiles/statecheck.js');



/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 */
    // Class Instances
var gameStateManager = app.gameStateManager,
    allEnemies = app.allEnemies,
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
    // Game loop time
    lastTime;




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

/* This function does some initial setup that should only occur once,
 * particularly setting the lastTime variable that is required for the
 * game loop.
 */
function init() {
    gameStateManager.toGamePlay();
    arrowsMovePlayer.turnOnEventListener();
    reset();
    timer.startTimer();
    lastTime = Date.now();
    main();
}

function buildStartScreen() {

    rendering.renderStartScreen();

    /* User can press enter key to start game.
     * listenerWrapper calls listener with init function as a parameter
     */
    pressEnterToStart.listenerWrapper(init);
    pressEnterToStart.turnOnEventListener();
}


/* This function is called by main (our game loop) and itself calls all
 * of the functions which may need to update entity's data. Based on how
 * you implement your collision detection (when two entities occupy the
 * same space, for instance when your character should die), you may find
 * the need to add an additional function call here. For now, we've left
 * it commented out - you may or may not want to implement this
 * functionality this way (you could just implement collision detection
 * on the entities themselves within your app.js file).
 */
function update(dt) {
    updateGameInformation();
    updateEntities(dt);
}

function elementStateChecks() {
    checkEnemyPlayerCollision();
    checkPlayerInWater();
    checkTimerForEnd();
}

/* This is called by the update function and loops through all of the
 * objects within your allEnemies array as defined in app.js and calls
 * their update() methods. It will then call the update function for your
 * player object. These update methods should focus purely on updating
 * the data/properties related to the object. Do your drawing in your
 * render methods.
 */
function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    player.update();
}

function updateGameInformation() {
    updateScore();
}

function updateScore() {
    var playerInTheWater = player.getInWaterStatus(),
        playerCollidedWithEnemy = player.getCollisionStatus();

    if (playerInTheWater) {
        score.update('up');
    } else if (playerCollidedWithEnemy) {
        score.update('down');
    }
}



/* This function initially draws the "game level", it will then call
 * the renderEntities function. Remember, this function is called every
 * game tick (or loop of the game engine) because that's how games work -
 * they are flipbooks creating the illusion of animation but in reality
 * they are just drawing the entire screen over and over.
 */
function render() {
    var gameState = gameStateManager.getCurrentState();

    rendering.renderGameGrid();
    rendering.renderEntities();
    rendering.renderGameInformation();

    if (gameState === 'endScreen') {
        rendering.renderEndScreen();
    }
}


/* This function does nothing but it could have been a good place to
 * handle game reset states - maybe a new game menu or a game over screen
 * those sorts of things. It's only called once by the init() method.
 */
function reset() {
    score.reset();
    timer.reset();
}


function cleanUp() {
    // Set collision statuses to false if needed
    if (player.getInWaterStatus() === true) {
        player.togglePlayerInWaterStatus();
    } else if (player.getCollisionStatus() === true) {
        player.toggleCollisionStatus();
    }
}

/* Go ahead and load all of the images we know we're going to need to
 * draw our game level. Then set init as the callback method, so that when
 * all of these images are properly loaded our game will start.
 */
resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png'
]);
resources.onReady(buildStartScreen);

