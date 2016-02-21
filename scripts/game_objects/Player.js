'use strict';

/** Player Class
 *
 *  Properties: sprite (image file)
 *  Methods: resetSprite, subscribeToCollisionStatus, subscribeToTimeIsUpStatus,
 *   update, render, handleInput
 *
 *  On instantiation, location is reset to starting tile
 *
 *  Subscriptions + subscriber funciton:
 *      collisionOccured: resetSprite
 *      timeIsUpStatus: resetSprite
 *
 *  Publishes:
 *      playerReachedWater
 */

var landmarks = require('../utilities/landmarks.js');
var resources = require('../utilities/resources.js');


var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.resetSprite();
};

Player.prototype.subscribeToCollisionStatus = function(statePubSub) {
    // bind Player object as 'this' for resetSprite
    var resetSpriteBound = this.resetSprite.bind(this);
    statePubSub.subscribe('collisionOccured', resetSpriteBound);
};


Player.prototype.subscribeToTimeIsUpStatus = function(statePubSub) {
    // bind Player object as 'this' for resetSprite
    var resetSpriteBound = this.resetSprite.bind(this);
    statePubSub.subscribe('timeIsUp', resetSpriteBound);
};


Player.prototype.resetSprite = function(){
    this.x = landmarks.xLeftSideOf.tile3;
    this.y = landmarks.yEntityAdjust.grass2;
};

Player.prototype.update = function(statePubSub) {
    var oneTileX = 101;
    var oneTileY = 83;

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
                statePubSub.publishStateChange('playerReachedWater', statePubSub);
                this.resetSprite();
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