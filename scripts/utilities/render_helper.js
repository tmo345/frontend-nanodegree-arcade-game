'use strict';

/** Default Styles
 *  Helpers to set the default styles and set new styles for the context
 *
 *  Idea is to have a default styling for all canvas rendering
 *  Individual render functions can selectively override portions of default styles
 *  as well as easily restore default style.
 *
 *  Exports:
 *      setNewContext: accepts an object with context style key value pairs and iterates
 *          over the object assigning each each style value to the equivalent context
 *          style property
 *      setDefaultStyles: set the styles in the defaultStyles object
 */


var defaultStyles = {
    textAlign: 'left',
    font: '36px "Bangers"',
    fillStyle: '#000',
    strokeStyle: '#fff',
    lineWidth: 2.5
};

function setNewContext(ctx, stylingObject) {
    for (var style in stylingObject) {
        if (stylingObject.hasOwnProperty(style)) {
            ctx[style] = stylingObject[style];
        }
    }
}

function setDefaultStyles(ctx) {
    setNewContext(ctx, defaultStyles);
}


module.exports = {
    setNewContext: setNewContext,
    setDefaultStyles: setDefaultStyles
};