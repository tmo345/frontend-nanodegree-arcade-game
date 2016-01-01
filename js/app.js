// Game tile grid

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
        water: 0, // Top water row
        stone1: 60, // Stone 1 of 3
        stone2: 143, // Stone 2 of 3
        stone3: 226, // Stone 3 of 3
        grass1: 309, // Grass 1 of 2
        grass2: 392 // Grass 2 of 2
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
    this.resetSprite();
};

Player.prototype.resetSprite = function(){
    this.x = grid.x.tile3;
    this.y = grid.y.grass2;

    this.spriteBounds = {
        left: 0,
        right: 404,
        upper: 60,
        lower: 392
    };
};

Player.prototype.update = function() {
    console.log(this.x, this.y);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (keyCode) {
    var left = 'left',
        right = 'right',
        up = 'up',
        down = 'down';

    if (keyCode === left) {
        if (this.x > this.spriteBounds.left) {
            this.x -= 101;
        }
    } else if (keyCode === right) {
        if (this.x < this.spriteBounds.right) {
            this.x += 101;
        }
    } else if (keyCode === up) {
        if (this.y > this.spriteBounds.upper) {
            this.y -= 83;
        } else {
            this.resetSprite();
        }
    } else if (keyCode === down) {
        if (this.y < this.spriteBounds.lower) {
            this.y += 83;
        }

    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];


var player = new Player();

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
