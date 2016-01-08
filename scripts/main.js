// Project 3: Classic Arcade Game Clone
// Udacity Front-End Web Devloper Nanodegree
// Timothy Moore

require.config({
   baseUrl: '/timo31415/u_project_3/scripts/'
});

require(['engine'],
function  ( engine ) {
    // Load resources and start game engine
    engine.startGameEngine();
});