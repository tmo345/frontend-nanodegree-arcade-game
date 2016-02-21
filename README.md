# Classic Arcade Game Clone
## Frontend Nanodegree Project 3
| Start Screen | Game Play | Game Over |
| --- | --- | --- |
| ![Arcade Game: Start Screen](images/GameStartScreen.png) | ![Arcade Game: Gam ePlay](images/gamePlay.png) | ![Arcade Game: Game Over](images/gameOver.png) |

### Game Overview

On the start screen, hit enter to start the game.

- Use the arrow keys to move the player.
- Move the player across the stone road to reach the water.
- You earn 100 points for every time you reach the water.
- Avoid the bugs as you cross the road.
- Every time you hit a bug you lose 50 points and move back to starting position
- The timer is set for 30 seconds. Go for your personal best (store locally).
- Press enter to start a new game.

### Game Mechanics
#### Tools
- Implemented commonJS modules in browser with Browserify/Watchify

#### Code Organization

- File Structure
  - bundle.js 
    - Concatenated javascript files 
  - engine.js 
    - Entry point for program. Main game loop.
  - engine_logic/
    - render, resets, state_checks, subscriptions, and updates
  - game_objects/ 
    - Enemy and Player classes, high_scores, instantiate_entities, score, timer
  - graphics_objects/
    - canvas, start_screen, graphics_objects
  - state_handling/ 
    - Event_handler class, eventlisteners, collision_handler, gamestate_handler, state_pubsub
  - utilities/
    - datastorage, landmarks, render_helper, resources

#### Basic Flow of Game Engine
###### See individual modules comments for details of implementation

- Most inter-object/module interaction occurs through statePubSub module with state change publishing and subscriptions

###### Setup 
- Resource loading, Eventlistener callbacks set, and Subscriptions started

###### Game Loop Entry and Flow
1. On resource load 
  2. Render startScreen
  3. Set gameState to startScreen
2. Event listeners toggle enterPressToStart on in response to gameState change
  3. User enter press event calls init
3. Init 
  4. Sets initial time
  5. Resets entities/game information
  6. Sets gameState to gamePlay
  7. Calls main (game loop)
4. Event listeners toggle enterPressToStart off and arrowsMovePlayer on
  5. Player now moves in response to user arrow key presses
5. Main:
  6. Tracks time passage with dt (delta time)
  7. Performs
    8. State checking
    9. Game element updating
    10. Game element rendering
  6. Calls itself at end of frame with window.requestAnimationframe.
7. State checks detect timer reaching 0
  8. GameState set to gameOver
8. Event Listeners toggle enterPressToStart on and arrowsMovePlayer off
9. gameOverScreen is rendered over the continuing game loop (enemies still move)
10. High scores
  11. Pulled from localStorage
  12. Checked against currentScore
  13. Updated if new high score achieved
  14. Pushed back to local storage
  15. Rendered to the DOM outside of canvas
11. Enter Press starts process again at number 4 with Init call
  12. Init calling reset is important here because enemies, score, and timer are all reset for new game

#### Publishing and Subscriptions

State_PubSub module receives published state changes and sends information to subscribers for each state by executing the subscriber functions 

States Monitored:
- timeIsUp
- collisionOccured
- playerReachedWater
- scoreChange
- gameStateChange


| State | Publishing Object/Module  | Values Passed (optional) | Subscribers (Object/Module / Function) |
| --- | --- | --- | --- |
| **timeIsUp** | timer | -- | player / resetSprite | 
| | | | gameStateHandler / toGameOver |
| | | | highScores / setHighScoreForGame and Render |
| **collisionOccured** | collision_handler  | -- | player / resetSprite |
| | | | score / _scoreDown |
| **playerReachedWater** |  Player | -- | score / _scoreUp |
| **scoreChange** | score | _currentScore | highScores /  |
| | | | |
| | | | |
