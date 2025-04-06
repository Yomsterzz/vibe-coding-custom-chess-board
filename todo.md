# To-Do List: Custom Board Chess Online

**Overall Project Setup:**

* [ ] Set up the basic project structure (HTML, CSS, JavaScript files).
* [ ] Choose any necessary libraries or frameworks (if any).
* [ ] Set up a version control system (like Git).

**User Interface (UI) Development:**

* [ ] Create the basic HTML structure for the single-page application (`index.html`).
* [ ] Implement the chessboard display (initially 8x8 with Unicode characters).
* [ ] Style the chessboard with basic CSS.
* [ ] Implement and style the chess notation display (a1, h8).
* [ ] Create the "Side Selection" radio buttons or dropdown.
* [ ] Create and style the "Custom Board Size Selector" (two dropdown menus).
* [ ] Create and style the "Settings" button (gear icon).
* [ ] Implement the "Settings Menu" (initially hidden):
    * [ ] Create the "Color Themes" dropdown or grid.
    * [ ] Create the "Animations" toggle switch.
    * [ ] Create the "Light/Dark Mode" toggle switch.
    * [ ] Create the "Move Input Method" toggle switch (Double Click/Drag and Drop).
    * [ ] Create the "Time Control" dropdown or radio buttons.
    * [ ] Create the "Bot Difficulty" dropdown or radio buttons.
* [ ] Create and style the prominent "Play" button.
* [ ] Create the "Game History Display" box or panel.
* [ ] Create and style the "PGN Download" button or link.
* [ ] Create and style the clearly visible "Resign" button.
* [ ] Create and style the "Whose Turn Indicator" display.
* [ ] Implement the visual indication for "Stockfish Availability" (disabled option/message).
* [ ] Implement the gray dots to indicate legal moves in drag-and-drop mode.
* [ ] Implement the extra gray dot for castling in drag-and-drop mode.
* [ ] Implement the red highlighting for illegal move attempts.
* [ ] Implement the "YOU WON!", "YOU DREW!", and "YOU LOST" mini-screens with animations.
* [ ] Implement the "Play Again" and "New Game" options after a game ends.
* [ ] Make sure the initial board setup is correct when the page loads.
* [ ] Implement the board flipping when the player chooses to play as Black.

**Game Logic Implementation:**

* [ ] Write the core game logic for standard chess rules:
    * [ ] Piece movement validation.
    * [ ] Capturing pieces.
    * [ ] Handling checks and checkmates.
    * [ ] Handling stalemates.
    * [ ] Pawn promotion.
    * [ ] Castling (standard 8x8 rules first).
* [ ] Implement the custom board size logic:
    * [ ] Adjust board boundaries for different sizes.
    * [ ] Implement the specific piece placement for 6xN, 7xN, 9xN, and 10xN boards.
    * [ ] Implement the one-square pawn move for 6xN and 7xN boards.
    * [ ] Implement the custom castling rules for 6x6, 9x9, and 10x10 boards.
* [ ] Implement the "Random" side selection logic.
* [ ] Implement the turn management system.
* [ ] Implement the game end detection (checkmate, stalemate, resignation).
* [ ] Implement the move history tracking in standard algebraic notation.
* [ ] Implement the PGN download functionality.

**Bot Opponent Logic:**

* [ ] Implement the "Beginner" AI logic (basic captures and checks).
* [ ] Implement the "Intermediate" AI logic (more selective captures, trading).
* [ ] Implement the "Difficult" AI logic (center control, defending, strategic play).
* [ ] Implement the Stockfish API integration for the "Impossible" difficulty (for 8x8 boards):
    * [ ] Construct the API request with the FEN string.
    * [ ] Send the API request.
    * [ ] Parse the JSON response.
    * [ ] Extract the best move.
    * [ ] Handle potential API errors and the 5-second timeout fallback to the "Difficult" bot.

**User Interactions:**

* [ ] Implement the double-click to move functionality.
* [ ] Implement the drag-and-drop to move functionality (with visual cues for legal moves and castling).
* [ ] Implement the logic to handle piece selection and destination square clicks/drops.
* [ ] Validate user moves against the game rules.
* [ ] Update the chessboard display after each valid move (user or bot).
* [ ] Update the game history display after each move.
* [ ] Implement the "Resign" button functionality.
* [ ] Implement the "Play" button functionality to start a new game with selected settings.
* [ ] Implement the "Play Again" button functionality.
* [ ] Implement the "New Game" option after a game ends.

**Visual Design & Themes:**

* [ ] Define the 10 distinct color palettes for the themes.
* [ ] Implement the CSS styles for each color theme, affecting the board, website elements, and piece font colors.
* [ ] Implement the light/dark mode toggle and ensure themes adapt accordingly.
* [ ] Ensure the Unicode chess pieces are clearly visible with the theme-based font colors.
* [ ] Style the UI elements to be visually appealing and intuitive.

**Testing:**

* [ ] Thoroughly test all game rules for all board sizes.
* [ ] Test the custom castling rules carefully.
* [ ] Test each bot difficulty level to ensure they behave as expected.
* [ ] Test the Stockfish API integration (for 8x8).
* [ ] Test all UI elements and their functionality.
* [ ] Test the move input methods (double-click and drag-and-drop).
* [ ] Test the game end conditions and animations.
* [ ] Test the PGN download functionality.
* [ ] Test the theme switching and light/dark mode.
* [ ] Test the rematch and new game options.
