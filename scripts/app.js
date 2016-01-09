var Enemy = require('./game/enemy.js'),
    GameStateManager = require('./game/gamestate.js'),
    grid = require('./utilities/grid.js'),
    Player = require('./game/player.js'),
    resources = require('./utilities/resources'),
    setupcanvas = require('./utilities/setupcanvas.js');





var ctx = setupcanvas.ctx;








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
    var score = new ScoreDisplay();
    var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
    var player = new Player();
    var gameEndScreen = new GameEndScreen();




    module.exports = {
        grid: grid,
        gameStateManager : gameStateManager,
        player: player,
        score: score,
        allEnemies: allEnemies,
        timer: timer,
        gameEndScreen: gameEndScreen
    };
