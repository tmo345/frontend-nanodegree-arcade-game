// Event handler class

var EventHandler = function(eventType, listener) {
    this.eventType = eventType;
    this.listener = listener;
};

// Some event listeners in the game perform a conditional check before executing
// a game loop function. The game loop function needs to be passed as a parameter.
// Typically, this would mean using an anonymous function in the addEventListener
// function, but a named method is needed to pass to removeEventListener.

// The listener wrapper takes an optional callback parameter for listeners that
// call a game function.

EventHandler.prototype.listenerWrapper = function(callback) {
    var that = this;
    that.wrapper = function() {
        if (callback) {
            that.listener(callback);
        } else {
            that.listener();
        }
    };
};


EventHandler.prototype.turnOnEventListener = function() {
    var that = this;
    document.addEventListener(that.eventType, that.wrapper);
};


EventHandler.prototype.turnOffEventListener = function() {
    var that = this;
    document.removeEventListener(that.eventType, that.wrapper);
};


module.exports = EventHandler;