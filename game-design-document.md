# One Way Out - Game Design Document

## **Status:** MVP(Minimum Viable Product) is playable.

## Game Overview

**Title:** One Way Out (working title)
**Theme:** "Only One" - interpreted as one way out of the maze
**Genre:** Puzzle/Adventure
**Platform:** Web Browser (HTML5/JavaScript)
**Perspective:** Top-down 2D

## Core Concept

A maze game where the player must navigate through a labyrinth to find the single exit. The "Only One" theme is interpreted as there being only one correct path to escape.

## Gameplay Mechanics

### Player Movement
- WASD for movement, will add arrow keys later for user preference
- Top-down perspective
- Smooth movement

### Maze Design
- Hand-crafted maze for now but later procedurally generated
- Single entrance, single exit
- Various difficulty levels, maybe increasing difficulty

### Win Condition
- Reach the exit of the maze

## Technical Requirements

### Browser Compatibility
- Must run in modern web browsers
- HTML5 Canvas for rendering
- JavaScript for game logic
- CSS for styling

### File Structure
```
one-way-out/
  - assets/     (images, sounds)
  - css/        (stylesheets)
  - js/         (game logic)
  - index.html  (main game file)
```

## Development Decisions Log

1. **Theme Interpretation:** "Only One" = one way out of the maze
2. **Perspective:** Top-down for clear maze navigation
3. **Technology Stack:** HTML5 Canvas + JavaScript for browser compatibility
4. Tile-based rendering system (25px tiles)
5. Sophisticated collision detection (checking all 4 corners)
6. 2D array maze representation (0=path, 1=wall, 2=exit)
7. Blue player rectangle with specific size (15x15px)

## Next Steps
- [x] Create basic HTML structure
- [x] Set up Canvas for rendering
- [x] Implement basic player movement
- [x] Create maze generation/layout system
- [x] Add collision detection
- [x] Implement win condition
- [x] Player rendering system - Blue rectangle player with proper sizing
- [x] Keyboard input handling - Complete WASD key event system
- [x] Game loop implementation - Proper requestAnimationFrame loop
- [x] Visual maze styling - Color coding (black walls, grey paths, green exit)
- [x] Win state display - Styled "You win!" message with background
- [x] Boundary checking - Prevents player from moving outside canvas
- [x] Movement speed control - Configurable rectSpeed system

## Potential Next Steps
- [ ] Add CSS styling
- [ ] Create larger/multiple mazes
- [ ] Add restart functionality
- [ ] Implement sound effects
- [ ] Add timer/score system

---
*Document started: Aug. 8, 2025*

*Last updated: Aug. 9, 2025* 