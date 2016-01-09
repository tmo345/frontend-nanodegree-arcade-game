var resources = require('./resources');

// Game Grid
// OS = Offscreen / T = Tile / E = Enemy / P = Player
//          OS  T1  T2  T3  T4  T5
//  water      |   |   |   |   |   |
//  stone1  E  |   |   |   |   |   |
//  stone2  E  |   |   |   |   |   |
//  stone3  E  |   |   |   |   |   |
//  grass1     |   |   |   |   |   |
//  grass2     |   |   | P |   |   |

var app = (function() {

    var grid = {
        x: {
            offScreen: -101,
            tile1: 0,
            tile2: 101,
            tile3: 202,
            tile4: 303,
            tile5: 404
        },
        y: {
            water: 0,
            stone1: 60,
            stone2: 143,
            stone3: 226,
            grass1: 309,
            grass2: 392
        }
    };

    var GameStateManager = function() {
        this.availableStates = {
            startScreen: 'startScreen',
            gamePlay: 'gamePlay',
            endScreen: 'endScreen'
        };
        // default state at instantiation is startScreen
        this.currentState = this.availableStates.startScreen;
    };

    GameStateManager.prototype.toStartScreen = function(){
        this.currentState = this.availableStates.startScreen;
    };

    GameStateManager.prototype.toGamePlay = function(){
        this.currentState = this.availableStates.gamePlay;
    };


    GameStateManager.prototype.toEndScreen = function(){
        this.currentState = this.availableStates.endScreen;
    };

    GameStateManager.prototype.getCurrentState = function() {
        return this.currentState;
    }


    // Enemies our player must avoid

    var Enemy = function() {

        this.sprite = 'images/enemy-bug.png';
        this.startingX = -101; // Offscreen
        this.rightBoundary = 505;

        this.resetSprite(); // set at startingX and give random speed and y
    };

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    Enemy.prototype.update = function(dt) {

        var updatedX = this.x + (this.speed * dt);
        if (updatedX > this.rightBoundary) {
            this.resetSprite();
        } else {
            this.x = updatedX;
        }

    };

    // Draw the enemy on the screen, required method for game
    Enemy.prototype.render = function() {
        ctx.drawImage(resources.get(this.sprite), this.x, this.y);
    };

    Enemy.prototype.setStart = function() {
        var possibleStarts = [
                grid.y.stone1,
                grid.y.stone2,
                grid.y.stone3
        ];
        // Random generate 0, 1, or 2 to correspond to possibleStarts array indices
        var randomNumber = Math.floor(Math.random() * 3);
        var startLocation = possibleStarts[randomNumber];
        return startLocation;
    };


    Enemy.prototype.setSpeed = function() {
        var minSpeed = 50;
        var maxSpeed = 300;
        return minSpeed + Math.floor(Math.random() * maxSpeed);
    };

    Enemy.prototype.resetSprite = function() {
        this.x = this.startingX;
        this.y = this.setStart();
        this.speed = this.setSpeed();
    };


    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.
    var Player = function() {
        this.sprite = 'images/char-boy.png';

        this.leftBoundary = 0;
        this.rightBoundary = 404;
        this.topBoundary = 60;
        this.bottomBoundary = 392;

        this.resetSprite();
    };

    Player.prototype.resetSprite = function(){
        this.x = grid.x.tile3;
        this.y = grid.y.grass2;
    };

    Player.prototype.update = function() {
        if (collisionStatus.playerInTheWater || collisionStatus.enemyPlayerCollided) {
            player.resetSprite();
        }
    };

    Player.prototype.render = function() {
        ctx.drawImage(resources.get(this.sprite), this.x, this.y);
    };

    Player.prototype.handleInput = function (keyCode) {
        var oneTileX = 101;
        var oneTileY = 83;

        if (keyCode === 'left') {
            if (this.x > this.leftBoundary) {
                this.x -= oneTileX;
            }
        } else if (keyCode === 'right') {
            if (this.x < this.rightBoundary) {
                this.x += oneTileX;
            }
        } else if (keyCode === 'up') {
                this.y -= oneTileY;
        } else if (keyCode === 'down') {
            if (this.y < this.bottomBoundary) {
                this.y += oneTileY;
            }

        }
    };

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        player.handleInput(allowedKeys[e.keyCode]);
    });


    var ScoreDisplay = function() {
        this.score = 0;
        this.x = 40;
        this.y = 100;
    };

    ScoreDisplay.prototype.render = function() {
        ctx.font = "36px sans-serif";
        ctx.fillText(this.score, this.x, this.y);
    };

    ScoreDisplay.prototype.update = function(directionOfChange) {
        if (directionOfChange === 'up') {
            this.score += 1;
        } else if (directionOfChange === 'down') {
            this.score -= 1;
        }

    };

    ScoreDisplay.prototype.reset = function() {
        this.score = 0;
    };

    // CollisionStatus Class

    var CollisionStatus = function() {
        this.enemyPlayerCollided = false;
        this.playerInTheWater = false;
    };

    CollisionStatus.prototype.toggleCollisionStatus = function() {
        if (! this.enemyPlayerCollided) {
            this.enemyPlayerCollided = true;
        } else {
            this.enemyPlayerCollided = false;
        }
    };

    CollisionStatus.prototype.togglePlayerInWaterStatus = function() {
        if (! this.playerInTheWater) {
            this.playerInTheWater = true;
        } else {
            this.playerInTheWater = false;
        }
    }



    var GameTimer = function() {
        this.timeLimit;
        this.reset();
        this.x = 430;
        this.y = 100;
    };

    GameTimer.prototype.startTimer = function() {
       this.timerInterval = window.setInterval(function(){
           console.log('calling interval');
           timer.timeLimit -= 1000;
       }, 1000);
    };

    GameTimer.prototype.render = function() {
        var timeInSeconds = this.timeLimit / 1000;

        ctx.font = "36px sans-serif";
        ctx.fillText(timeInSeconds, this.x, this.y);
    };

    GameTimer.prototype.reset = function() {
        this.timeLimit = 3000;
    };

    var GameEndScreen = function() {

    };

    GameEndScreen.prototype.render = function() {
        this.scoreText = 'You scored ' + score.score + ' points!';
        this.playAgainText = 'To play again: press spacebar';
        ctx.font = '36px sans-serif';

        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(50, 200, 400, 300);

        ctx.textAlign = 'center';
        // ctx.strokeStyle = '#ccc';
        ctx.fillStyle = '#000';
        // ctx.lineWidth = 2;
        ctx.fillText(this.scoreText, canvas.width/2, (canvas.height/2));
        ctx.font = '24px sans-serif';
        ctx.fillText(this.playAgainText, canvas.width/2, (canvas.height/2) + 100);
        // ctx.strokeText(this.text, canvas.width/2, (canvas.height/2) - 30);


    };

    GameEndScreen.prototype.addRestartEventListener = function() {
        document.addEventListener('keyup', function(e) {
            if (gameState.gameEnded) {
                if (e.keyCode === 32) {
                    gameState.gameEnded = false;
                    init();
                }

            }
        });

    };

    GameEndScreen.prototype.handleInput = function(keyCode) {

    };

    var gameState = {
        startScreen: false,
        gamePlaying: false,
        gameEnded: false
    };

    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
    var gameStateManager = new GameStateManager();
    var timer = new GameTimer();
    var collisionStatus = new CollisionStatus();
    var score = new ScoreDisplay();
    var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
    var player = new Player();
    var gameEndScreen = new GameEndScreen();




    module.exports = {
        grid: grid,
        gameStateManager : gameStateManager,
        gameState: gameState,
        player: player,
        collisionStatus: collisionStatus,
        score: score,
        allEnemies: allEnemies,
        timer: timer,
        gameEndScreen: gameEndScreen
    };
}());
