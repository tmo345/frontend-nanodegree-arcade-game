var landmarks = require('../utilities/landmarks.js'),
    resources = require('../utilities/resources.js');


var Player = function() {
    this.sprite = 'images/char-boy.png';

    this.collidedWithEnemy = false;
    this.inTheWater = false;

    this.resetSprite();
};

Player.prototype.setSubscriptions = function(stateTracker) {
    // ensure that this refers to player when stateTracker calls toggleCollisionStatus
    var toggleCollisionBound = this.toggleCollisionStatus.bind(this),
        toggleInWaterBound = this.togglePlayerInWaterStatus.bind(this);

    // Try catch to pick up errors in calling for a state subscription that does not exit
    try {
        stateTracker.subscribe('collisionOccured', toggleCollisionBound);
        stateTracker.subscribe('playerReachedWater', toggleInWaterBound);
    } catch (e) {
        console.error(e.message);
    }

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

Player.prototype.cleanUp = function() {
    if (this.collidedWithEnemy) {
        this.collidedWithEnemy = false;
    }
    if (this.inTheWater) {
        this.inTheWater = false;
    }

};


// Player.prototype.getInWaterStatus = function() {
//     return this.inTheWater;
// };

// Player.prototype.getCollisionStatus = function() {
//     return this.collidedWithEnemy;
// };


Player.prototype.resetSprite = function(){
    this.x = landmarks.xLeftSideOf.tile3;
    this.y = landmarks.yEntityAdjust.grass2;

    // this.collidedWithEnemy = false;
    // this.inTheWater = false;
};

Player.prototype.update = function() {
    var oneTileX = 101;
    var oneTileY = 83;

    if (this.collidedWithEnemy || this.inTheWater)  {
        this.resetSprite();
    }

    if (this.moving === true) {
        if (this.nextMovement === 'left') {
            if (this.x > landmarks.boundaries.left) {
                this.x -= oneTileX;
            }
        } else if (this.nextMovement === 'right') {
            if (this.x < landmarks.boundaries.right) {
                this.x += oneTileX;
            }
        } else if (this.nextMovement === 'up') {
            if (this.y > landmarks.boundaries.top) {
                this.y -= oneTileY;
            } else {
                // This is so player moves slightly into water before being reset
                this.y -= 10;
            }
        } else if (this.nextMovement === 'down') {
            if (this.y < landmarks.boundaries.bottom) {
                this.y += oneTileY;
            }
        }
    this.moving = false;
    }


};

Player.prototype.render = function(ctx) {
    ctx.drawImage(resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (keyCode) {
    this.moving = true;
    this.nextMovement = keyCode;
};


module.exports = Player;