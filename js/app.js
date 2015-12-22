// Game tile grid and player movement boundaries

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
    },
    moveBoundaries: {
        left: 0,
        right: 404,
        upper: 53,
        lower: 385
    }
}


// Enemies our player must avoid

var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = grid.x.offScreen;
    this.y = this.setStart();

    this.speed = this.setSpeed();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var currentX = this.x;
    var updatedX = currentX + (this.speed * dt);
    if (currentX > 505) {
        this.x = -101;
        this.y = this.setStart();
        this.speed = this.setSpeed();
    } else {
        this.x = updatedX;
    }

    if (this.x >= (player.x) && this.x <= (player.x + 101) && this.y >= (player.y) && this.y <= (player.y + 171)) {
        player.x = grid.x.tile3;
        player.y = grid.y.grass2;
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
    var randomNumber = Math.floor(Math.random() * 3);
    var startLocation = possibleStarts[randomNumber];
    return startLocation;
}

Enemy.prototype.setSpeed = function() {
    return 100 + (Math.floor(Math.random() * (250 - 50)));
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = grid.x.tile3;
    this.y = grid.y.grass2;
};


Player.prototype.update = function() {
    // console.log(player.x, player.y);
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
