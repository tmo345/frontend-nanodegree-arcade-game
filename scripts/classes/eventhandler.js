// EventHandler class

// listener function should take callback param that it will conditionally invoke
// ex: function listener(callback) { if (conditionMet) { callback() }
var EventHandler = function(eventType, listener) {
    this.eventType = eventType;
    this.listener = listener;
};

// set a wrapper function that takes a callback as a param
// the wrapper's job is to invoke the listener function with callback argument
EventHandler.prototype.listenerWrapper = function(callback) {
    var that = this;
    that.wrapper = function() {
        that.listener(callback);
    };
};

// wrapper is passed to addEventListener
// when event is triggered, the wrapper calls listener(callback)
// the listener makes a condition check and if met invokes the callback
EventHandler.prototype.turnOnEventListener = function() {
    var that = this;
    document.addEventListener(that.eventType, that.wrapper);
};

// as a bonus, we can now pass this.wrapper to removeEventListener to turn off
// the eventlistener
EventHandler.prototype.turnOffEventListener = function() {
    var that = this;
    document.removeEventListener(that.eventType, that.wrapper);
};


module.exports = EventHandler;