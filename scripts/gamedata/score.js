var renderHelper = require('../utilities/renderhelper.js'),
    landmarks = require('../utilities/landmarks.js');


var gameScore = {

    currentScore: 0,

    headingX: landmarks.xLeftSideOf.tile1 + 10,
    headingY: landmarks.yTopOf.water + 50,

    scoreX: landmarks.xLeftSideOf.tile2 + 10,
    scoreY: landmarks.yTopOf.water + 50,

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

    render: function(ctx) {
        renderHelper.setDefaultStyles(ctx);

        ctx.strokeText('Score :', this.headingX, this.headingY);
        ctx.fillText('Score :', this.headingX, this.headingY);

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
            ctx.strokeText(' ' + this.currentScore, this.scoreX, this.scoreY);
            ctx.fillText(' ' + this.currentScore, this.scoreX, this.scoreY);
        } else {
            ctx.strokeText(this.currentScore, this.scoreX, this.scoreY);
            ctx.fillText(this.currentScore, this.scoreX, this.scoreY);
        }
    },

    update: function(directionOfChange, amount) {
        var that = this;

        if (directionOfChange === 'up') {
            this.currentScore += amount;
            this.highlightedGreen = true;
            // Green score flash and larger font for 350ms
            window.setTimeout(function() {
                that.highlightedGreen = false;
            }, 350);
        } else if (directionOfChange === 'down') {
            this.currentScore -= amount;
            this.highlightedRed = true;
            // Red score flash and larger font for 350ms
            window.setTimeout(function() {
                that.highlightedRed = false;
            }, 350);
        }
    }
};

module.exports = gameScore;