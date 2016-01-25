/** Default Styles
 *  Helpers to set the default styles and set new styles for the context
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