// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.recentLocation = 60 + (Math.floor(Math.random() * (3 - 0))) * 83;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -101;
    this.y = this.recentLocation;
    this.speed = 100 + (Math.floor(Math.random() * (250 - 50)));
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var numberX = this.x;
    numberX += this.speed * dt;
    if (numberX > 505) {
        this.x = -101;
        this.recentLocation = (60 + (Math.floor(Math.random() * (3 - 0))) * 83);
        this.y = this.recentLocation;
        this.speed = 50 + (Math.floor(Math.random() * (250 - 50)));
    } else {
        this.x = numberX;
        this.y = this.recentLocation;
    }

    if (this.x >= (player.x) && this.x <= (player.x + 101) && this.y >= (player.y) && this.y <= (player.y + 171)) {
        player.x = 202;
        player.y = 385;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 385;
};


Player.prototype.update = function() {
    console.log(player.x, player.y);
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
        if (this.x > 0) {
            this.x -= 101;
        }
    } else if (keyCode === right) {
        if (this.x < 404) {
            this.x += 101;
        }
    } else if (keyCode === up) {
        if (this.y > 53) {
            this.y -= 83;
        } else {
            this.x = 202;
            this.y = 385;
        }
    } else if (keyCode === down) {
        if (this.y < 385) {
            this.y += 83;
        }

    }
}

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
