var renderHelper = require('../utilities/renderhelper.js');

var gameTimer = {

    timeLimit: 7000,
    headingX: 320,
    headingY: 102.5,
    timeLeftX: 430,
    timeLeftY: 105,
    timeRunningOut: false,
    timeIsUp: false,

    timeRunningOutStyles: {
        fillStyle: 'red'
    },

    _startTimer: function() {
        var that = this;
        this.timerInterval = window.setInterval(function(){
                that.timeLeft -= 1000;
        }, 1000);
    },

    _stopTimer: function() {
        var that = this;
        window.clearInterval(that.timerInterval);
    },

    // Set up time left so that we just need to set the timeLimit property
    // in one place if we want to change it later.
    _setUpTimeLeft: function() {
        this.timeLeft = this.timeLimit;
    },

    reset: function() {
        this._setUpTimeLeft();
        this.timeIsUp = false;
        this.timeRunningOut = false;
        this._startTimer();
    },


    checkTimerForEnd: function() {
        if (this.timeLeft === 0) {
            this.timeIsUp = true;
            return true;
        }
    },

    update: function() {
        if (this.timeLeft <= 5000) {
            this.timeRunningOut = true;
        }
        if (this.timeIsUp) {
            this._stopTimer();
        }
    },

    render: function(ctx) {
        var timeInSeconds = this.timeLeft / 1000;

        renderHelper.setDefaultStyles(ctx);

        ctx.strokeText('Timer :', this.headingX, this.headingY);
        ctx.fillText('Timer :', this.headingX, this.headingY);

        // when time is almost out, make the time left red
        if (this.timeRunningOut) {
            renderHelper.setNewContext(ctx, this.timeRunningOutStyles);
        }

        ctx.strokeText(timeInSeconds, this.timeLeftX, this.timeLeftY);
        ctx.fillText(timeInSeconds, this.timeLeftX, this.timeLeftY);

    }


};


module.exports = gameTimer;