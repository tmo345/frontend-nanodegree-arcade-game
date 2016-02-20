// EventHandler class

// listener function should take callback param that it will conditionally invoke
// ex: function listener(callback) { if (conditionMet) { callback() }
var EventHandler = function(eventType, listener) {
    this.eventType = eventType;
    this.listener = listener;
    this.onOffState = 'off';
};

// set a wrapper function that takes a callback as a param
// the wrapper's job is to invoke the listener function with callback argument
EventHandler.prototype.setListenerCallback = function(callback) {
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
    this.onOffState = 'on';
    document.addEventListener(that.eventType, that.wrapper);
};

// as a bonus, we can now pass this.wrapper to removeEventListener to turn off
// the eventlistener
EventHandler.prototype.turnOffEventListener = function() {
    var that = this;
    this.onOffState = 'off';
    document.removeEventListener(that.eventType, that.wrapper);
};

EventHandler.prototype.reportOnOffState = function() {
    return this.onOffState;
};

EventHandler.prototype.setSubscription = function(statePubSub, state, callback) {
    statePubSub.subscribe(state, callback);
};


module.exports = EventHandler;