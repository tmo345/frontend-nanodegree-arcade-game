var renderHelper = require('../rendering/renderhelper.js'),
    landmarks = require('../utilities/landmarks.js');


var gameScore = {

    currentScore: 0,
    scoreUpAmount: 100,
    scoreDownAmount: 50,

    heading: {
        text: 'Score: ',
        x: landmarks.xLeftSideOf.tile1 + 10,
        y: landmarks.yTopOf.water + 50
    },

    scoreText: {
        fillerSpace: ' ',
        x: landmarks.xLeftSideOf.tile2 + 10,
        y: landmarks.yTopOf.water + 50
    },

    highlightedGreen: false,
    highlightedRed: false,

    scoreUpStyles: {
        fillStyle: 'green',
        font: '45px "Bangers"'
    },

    scoreDownStyles: {
        fillStyle: 'red',
        font: '45px "Bangers"'
    },

    reset: function() {
        this.currentScore = 0;
    },

    changeScore: function(directionOfChange) {
        var that = this;
        if (directionOfChange === 'up') {
            this.currentScore += this.scoreUpAmount;
            this.highlightedGreen = true;
            // Green score flash and larger font for 350ms
            window.setTimeout(function() {
                that.highlightedGreen = false;
            }, 350);
        } else if (directionOfChange === 'down') {
            this.currentScore -= this.scoreDownAmount;
            this.highlightedRed = true;
            // Red score flash and larger font for 350ms
            window.setTimeout(function() {
                that.highlightedRed = false;
            }, 350);
        }
    },

    // Expect an instance of player with getInWaterStatus and getCollisionStatus methods
    update: function(player) {
        var playerInTheWater = player.getInWaterStatus(),
            playerCollidedWithEnemy = player.getCollisionStatus();

        if (playerInTheWater) {
            this.changeScore('up');
        } else if (playerCollidedWithEnemy) {
            this.changeScore('down');
        }
    },

    render: function(ctx) {

        ctx.strokeText(this.heading.text, this.heading.x, this.heading.y);
        ctx.fillText(this.heading.text, this.heading.x, this.heading.y);

        // Highlighted green and red properties toggled in update method
        // when score changes
        if (this.highlightedGreen === true) {
            renderHelper.setNewContext(ctx, this.scoreUpStyles);
        } else if (this.highlightedRed === true) {
            renderHelper.setNewContext(ctx, this.scoreDownStyles);
        }

        // Add extra space for positive so that negatives don't seem to shift
        // over to the right with negative sign
        if (this.score >= 0) {
            ctx.strokeText(this.scoreText.fillerSpace + this.currentScore, this.scoreText.x, this.scoreText.y);
            ctx.fillText(this.scoreText.fillerSpace + this.currentScore, this.scoreText.x, this.scoreText.y);
        } else {
            ctx.strokeText(this.currentScore, this.scoreText.x, this.scoreText.y);
            ctx.fillText(this.currentScore, this.scoreText.x, this.scoreText.y);
        }
    }
};

module.exports = gameScore;