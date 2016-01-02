// Game Grid
// OS = Offscreen / T = Tile / E = Enemy / P = Player
//          OS  T1  T2  T3  T4  T5
//  water      |   |   |   |   |   |
//  stone1  E  |   |   |   |   |   |
//  stone2  E  |   |   |   |   |   |
//  stone3  E  |   |   |   |   |   |
//  grass1     |   |   |   |   |   |
//  grass2     |   |   | P |   |   |


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

    if (this.x >= (player.x - 50) && this.x <= (player.x + 101) && this.y >= (player.y) && this.y <= (player.y + 171)) {
        player.resetSprite();
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
    console.log(this.x, this.y);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
        if (this.y > this.topBoundary) {
            this.y -= oneTileY;
        } else {
            this.resetSprite();
        }
    } else if (keyCode === 'down') {
        if (this.y < this.bottomBoundary) {
            this.y += oneTileY;
        }

    }
};

var ScoreDisplay = function() {
    this.score = 0;
    this.x = 40;
    this.y = 100;
};

ScoreDisplay.prototype.render = function() {
    ctx.font = "36px sans-serif";
    ctx.fillText(this.score, this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];


var player = new Player();

var score = new ScoreDisplay();
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
