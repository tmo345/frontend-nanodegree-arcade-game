define(function() {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = 505;
    canvas.height = 606;
    document.body.appendChild(canvas);

    return {
        canvas: canvas,
        ctx: ctx
    };
});

