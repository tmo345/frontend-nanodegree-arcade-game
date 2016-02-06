var landmarks = require('../utilities/landmarks.js'),
    resources = require('../utilities/resources.js');

// Enemies our player must avoid

var Enemy = function() {

    this.sprite = 'images/enemy-bug.png';
    this.startingX = landmarks.xLeftSideOf.offScreenLeft;
    this.rightBoundary = landmarks.xLeftSideOf.offScreenRight;

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
Enemy.prototype.render = function(ctx) {
    ctx.drawImage(resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.setStart = function() {
    var possibleStarts = [
            landmarks.yEntityAdjust.stone1,
            landmarks.yEntityAdjust.stone2,
            landmarks.yEntityAdjust.stone3
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

module.exports = Enemy;