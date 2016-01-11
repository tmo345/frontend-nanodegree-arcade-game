var canvas = require('../utilities/canvas.js');


var ctx = canvas.ctx;

var Score = function() {
        this.score = 0;
        this.x = 40;
        this.y = 100;
    };

Score.prototype.render = function() {
    ctx.font = "36px sans-serif";
    ctx.fillText(this.score, this.x, this.y);
};

Score.prototype.update = function(directionOfChange) {
    if (directionOfChange === 'up') {
        this.score += 1;
    } else if (directionOfChange === 'down') {
        this.score -= 1;
    }

};

Score.prototype.reset = function() {
    this.score = 0;
};

module.exports = Score;