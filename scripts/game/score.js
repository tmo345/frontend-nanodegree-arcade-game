var canvas = require('../utilities/canvas.js');


var ctx = canvas.ctx;

var Score = function() {
        this.score = 0;
        this.headingX = 10;
        this.headingY = 102.5;
        this.scoreX = 110;
        this.scoreY = 105;

        this.textColor = '#000';
        this.font = '36px "Bangers';
        this.highlighted = false;
    };

Score.prototype.render = function() {
    ctx.textAlign = 'left';
    ctx.font = '30px "Bangers"';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.strokeText('Score :', this.headingX, this.headingY);
    ctx.fillStyle = '#000';
    ctx.fillText('Score :', this.headingX, this.headingY);
    ctx.font = this.font;
    ctx.fillStyle = this.textColor;
    if (this.score >= 0) {
        // Add extra space for positive so that negatives don't seem to shift
        // over to the right with negative sign
        ctx.strokeText(' ' + this.score, this.scoreX, this.scoreY);
        ctx.fillText(' ' + this.score, this.scoreX, this.scoreY);
    } else {
        ctx.strokeText(this.score, this.scoreX, this.scoreY);
        ctx.fillText(this.score, this.scoreX, this.scoreY);
    }

};

Score.prototype.update = function(directionOfChange) {
    var that = this;
    if (directionOfChange === 'up') {
        this.score += 100;
        this.textColor = 'green';
        this.font = '45px "Bangers"';
        setTimeout(function() {
            that.textColor = '#000';
            that.font = '36px "Bangers"';
        }, 350);
    } else if (directionOfChange === 'down') {
        this.score -= 100;
        this.textColor = 'red';
        this.font = '45px "Bangers"';
        setTimeout(function() {
            that.textColor = '#000';
            that.font = '36px "Bangers"';
        }, 350);
    }
};

Score.prototype.reset = function() {
    this.score = 0;
};

module.exports = Score;