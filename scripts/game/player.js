var grid = require('../utilities/grid.js'),
    resources = require('../utilities/resources.js'),
    canvas = require('../utilities/canvas.js');

var ctx = canvas.ctx;

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.leftBoundary = 0;
    this.rightBoundary = 404;
    this.topBoundary = 60;
    this.bottomBoundary = 392;

    this.collidedWithEnemy = false;
    this.inTheWater = false;
    this.overGem = false;

    this.resetSprite();
};

Player.prototype.toggleCollisionStatus = function() {
    if (! this.collidedWithEnemy) {
        this.collidedWithEnemy = true;
    } else {
        this.collidedWithEnemy = false;
    }
};

Player.prototype.togglePlayerInWaterStatus = function() {
    if (! this.inTheWater) {
        this.inTheWater = true;
    } else {
        this.inTheWater = false;
    }
};

Player.prototype.toggleOverGemStatus = function() {
    if (! this.overGem) {
        this.overGem = true;
    } else {
        this.overGem = false;
    }
};

Player.prototype.getInWaterStatus = function() {
    return this.inTheWater;
};

Player.prototype.getCollisionStatus = function() {
    return this.collidedWithEnemy;
};

Player.prototype.getOverGemStatus = function() {
    return this.overGem;
}

Player.prototype.resetSprite = function(){
    this.x = grid.x.tile3;
    this.y = grid.y.grass2;

    this.collidedWithEnemy = false;
    this.inTheWater = false;
};

Player.prototype.update = function() {
    if (this.inTheWater || this.collidedWithEnemy) {
        this.resetSprite();
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


module.exports = Player;