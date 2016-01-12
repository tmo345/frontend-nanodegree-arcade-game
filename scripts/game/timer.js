var canvas = require('../utilities/canvas.js');

var ctx = canvas.ctx;


var GameTimer = function() {
    this.timeLimit;
    this.reset();
    this.x = 430;
    this.y = 105;
    this.headingX = 320;
    this.headingY = 102.5;
};

GameTimer.prototype.startTimer = function() {
   var that = this;

   this.timerInterval = setInterval(function(){
       that.timeLimit -= 1000;
   }, 1000);
};

GameTimer.prototype.stopTimer = function() {
    var that = this;

    clearInterval(that.timerInterval);
};

GameTimer.prototype.render = function() {
    var timeInSeconds = this.timeLimit / 1000;
    ctx.font = '36px "Bangers"';
    ctx.textAlign = 'left';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.strokeText(timeInSeconds, this.x, this.y);
    ctx.fillStyle = '#000';
    ctx.fillText(timeInSeconds, this.x, this.y);
    ctx.font = '30px "Bangers"';
    ctx.strokeText('Timer :', this.headingX, this.headingY);
    ctx.fillText('Timer :', this.headingX, this.headingY);

};

GameTimer.prototype.reset = function() {
    this.timeLimit = 30000;
};

module.exports = GameTimer;