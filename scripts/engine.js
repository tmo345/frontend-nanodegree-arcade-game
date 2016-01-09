var app = require('./app'),
    setupcanvas = require('./utilities/setupcanvas.js'),
    resources = require('./utilities/resources.js');


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
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var canvas = setupcanvas.canvas,
        ctx = setupcanvas.ctx,
        lastTime,
        gameStateManager = app.gameStateManager,
        grid = app.grid,
        gameState = app.gameState,
        allEnemies = app.allEnemies,
        player = app.player,
        collisionStatus = app.collisionStatus,
        score = app.score,
        timer = app.timer,
        gameEndScreen = app.gameEndScreen;




    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        if (gameStateManager.getCurrentState() === 'endScreen') {
            return;
        }

        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        /* Call our update/render/cleanUp functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
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
        gameEndScreen.addRestartEventListener();
        reset();
        timer.startTimer();
        lastTime = Date.now();
        main();
    }

    function startScreenInit() {
        // Render Game map
        renderGameGrid();
        // Instruction text
        ctx.font = '24px "Audiowide"';
        ctx.fillText('Steve Crosses the Road', 5, 40);
        ctx.font = '18px "Audiowide"';
        ctx.rotate(-2 * Math.PI / 180);
        ctx.fillText('Into The Water for Some Reason', 150, 110);
        ctx.resetTransform();
        ctx.font = '24px "Audiowide"';
        ctx.fillText('Press', grid.x.tile2 + 10, grid.y.grass1 + 125);
        ctx.fillText('Enter', grid.x.tile3 + 10, grid.y.grass1 + 125);
        ctx.fillText('To', grid.x.tile4 + 10, grid.y.grass1 + 125);
        ctx.fillText('Start', grid.x.tile2 + 10, grid.y.grass2 + 125);
        ctx.fillText('Game', grid.x.tile3 + 10, grid.y.grass2 + 125);
        // Draw player and bug
        ctx.drawImage(resources.get('images/char-boy.png'), grid.x.tile5, grid.y.stone2);
        ctx.drawImage(resources.get('images/enemy-bug.png'), grid.x.tile2, grid.y.stone1);
        ctx.drawImage(resources.get('images/enemy-bug.png'), grid.x.tile3, grid.y.stone2);
        ctx.drawImage(resources.get('images/enemy-bug.png'), grid.x.tile2, grid.y.stone3);
    }

    document.addEventListener('keyup', function(e) {
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            init();
        }
    });


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
        checkEnemyPlayerCollision();
        checkPlayerInWater();
        checkTimer();
        updateGameInformation();
        updateEntities(dt);
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
        processScoreChange();
    }

    function processScoreChange() {
        var inTheWater = player.getInWaterStatus(),
            collidedWithEnemy = player.getCollisionStatus();

        if (inTheWater) {
            score.update('up');
        } else if (collidedWithEnemy) {
            score.update('down');
        }
    }

    // Check for collision and toggle collision status if collision detected
    function checkEnemyPlayerCollision() {
        var occupySameX,
            occupySameY,
            enemyPlayerCollided;

        allEnemies.forEach(function(enemy) {
            occupySameX = (enemy.x + 96) >= (player.x + 17) && enemy.x <= (player.x + 83);
            occupySameY = enemy.y === player.y;
            enemyPlayerCollided = occupySameX && occupySameY;

            if (enemyPlayerCollided) {
                player.toggleCollisionStatus();
            }
        });
    }

    // Check for player in water and toggle player in water status if detected
    function checkPlayerInWater() {
        var playerInTheWater = player.y < player.topBoundary;

        if (playerInTheWater) {
            player.togglePlayerInWaterStatus();
        }
    }

    function checkTimer() {
        if (timer.timeLimit === 0) {

            gameStateManager.toEndScreen();

        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        renderGameGrid();
        renderEntities();
        renderGameInformation();
    }

    function renderGameGrid() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    function renderGameInformation() {
        score.render();
        timer.render();
        if (gameStateManager.getCurrentState() === 'endScreen') {
            gameEndScreen.render();
            window.clearInterval(timer.timerInterval);

        }
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        score.reset();
        timer.reset();
        gameState.gameEnded = false;
    }


    function cleanUp() {
        // Set collision statuses to false if needed
        if (collisionStatus.playerInTheWater) {
            collisionStatus.togglePlayerInWaterStatus();
        } else if (collisionStatus.enemyPlayerCollided) {
            collisionStatus.toggleCollisionStatus();
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
    resources.onReady(startScreenInit);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    window.ctx = ctx;
    window.canvas = canvas;

})(this);
