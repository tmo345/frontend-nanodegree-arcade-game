var canvas = require('../utilities/canvas.js');

var ctx = canvas.ctx;


var GameTimer = function() {
    this.timeLimit;
    this.reset();
    this.x = 430;
    this.y = 100;
};

GameTimer.prototype.startTimer = function() {
   var that = this;

   this.timerInterval = setInterval(function(){
       console.log('calling interval');
       that.timeLimit -= 1000;
   }, 1000);
};

GameTimer.prototype.stopTimer = function() {
    var that = this;

    clearInterval(that.timerInterval);
};

GameTimer.prototype.render = function() {
    var timeInSeconds = this.timeLimit / 1000;

    ctx.font = "36px sans-serif";
    ctx.fillText(timeInSeconds, this.x, this.y);
};

GameTimer.prototype.reset = function() {
    this.timeLimit = 3000;
};

module.exports = GameTimer;