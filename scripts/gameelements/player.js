var landmarks = require('../utilities/landmarks.js'),
    resources = require('../utilities/resources.js');

/**
 * Represents the user controlled player
 * @constructor
 *
 * @property {string} sprite - Player sprite image path
 * @property {Boolean} collidedWithEnemy
 * @property {Boolean} inTheWater
 */

var Player = function() {
    this.sprite = 'images/char-boy.png';

    this.collidedWithEnemy = false;
    this.inTheWater = false;

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


Player.prototype.getInWaterStatus = function() {
    return this.inTheWater;
};

Player.prototype.getCollisionStatus = function() {
    return this.collidedWithEnemy;
};


Player.prototype.resetSprite = function(){
    this.x = landmarks.xLeftSideOf.tile3;
    this.y = landmarks.yEntityAdjust.grass2;

    // this.collidedWithEnemy = false;
    // this.inTheWater = false;
};

Player.prototype.update = function() {
    if (this.inTheWater || this.collidedWithEnemy) {
        this.resetSprite();
    }
};

Player.prototype.render = function(ctx) {
    ctx.drawImage(resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (keyCode) {
    var oneTileX = 101;
    var oneTileY = 83;

    if (keyCode === 'left') {
        if (this.x > landmarks.boundaries.left) {
            this.x -= oneTileX;
        }
    } else if (keyCode === 'right') {
        if (this.x < landmarks.boundaries.right) {
            this.x += oneTileX;
        }
    } else if (keyCode === 'up') {
            this.y -= oneTileY;
    } else if (keyCode === 'down') {
        if (this.y < landmarks.boundaries.bottom) {
            this.y += oneTileY;
        }

    }
};


module.exports = Player;