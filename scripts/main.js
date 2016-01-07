// Project 3: Classic Arcade Game Clone
// Udacity Front-End Web Devloper Nanodegree
// Timothy Moore

// Load and start game engine
requirejs(['engine'],
function  ( engine) {
    engine.startGameEngine();
}, function (err) {
      console.log( err.requireType );
      console.log( err.requireModules );
});