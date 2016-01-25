var renderHelper = require('../utilities/renderhelper.js');

var gameScore = {

    currentScore: 0,
    headingX: 10,
    headingY: 102.5,
    scoreX: 110,
    scoreY: 105,
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
            window.setTimeout(function() {
                that.highlightedGreen = false;
            }, 350);
        } else if (directionOfChange === 'down') {
            this.currentScore -= amount;
            this.highlightedRed = true;
            window.setTimeout(function() {
                that.highlightedRed = false;
            }, 350);
        }
    }
};

module.exports = gameScore;