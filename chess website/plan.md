# Product Requirements Document: Custom Board Chess Online

**Product Name:** Custom Board Chess Online

**Version:** 1.1

**Date:** April 6, 2025

**Author:** AI Assistant

**1. Introduction**

This document outlines the updated requirements for a single-page web application, "Custom Board Chess Online". This website will allow users to play chess against a computer bot on a customizable chessboard, with various difficulty levels, time controls, and visual themes. This version includes clarifications and additions based on further discussions.

**2. Goals**

* Provide a fun and engaging platform for users to play chess online.
* Offer customization options for the chessboard size and appearance.
* Implement AI opponents with varying difficulty levels to cater to different player skills.
* Allow players to track their game history and download it for later review.
* Provide clear visual feedback for user interactions and game events.

**3. Target Audience**

* Individuals interested in playing chess online.
* Chess enthusiasts of all skill levels, from beginners to advanced players.
* Users who enjoy customizing their gaming experience.

**4. Product Description**

The "Custom Board Chess Online" website will present a dynamic chessboard on a single webpage. Users will be able to:

* Customize the size of the chessboard (6x6 to 10x10).
* Choose to play as White, Black, or Random (computer gets the opposite color).
* Select from multiple visually appealing color themes affecting the board, website elements, and piece font color.
* Toggle move animations and light/dark mode.
* Set time controls for the game: Blitz (3 minutes), Rapid (10 minutes), No Limit.
* Play against computer bots with adjustable difficulty levels: Beginner, Intermediate, Difficult, Impossible (only available for 8x8 boards).
* View the game history in real-time and download it as a PGN file.
* Move pieces by double-clicking or by dragging and dropping (toggleable in settings).
* Receive visual feedback for illegal moves.
* See animated notifications for game end states (Win, Lose, Draw).
* Rematch with the same settings or choose new game parameters.

**5. Detailed Requirements**

**5.1. User Interface (UI)**

* **Single Page Application:** The entire game experience will be contained on the `https://customboardchessonline.com/play/` URL.
* **Chessboard Display:**
    * Initially, an 8x8 chessboard with standard piece placement (using Unicode characters with colored fonts) will be shown.
    * Chess notation (e.g., a1, h8) will be displayed along the sides of the board.
    * The board and pieces will visually update after each move.
    * If the player chooses to play as Black, the board will be flipped so Black is at the bottom.
* **Side Selection:**
    * Radio buttons or a dropdown menu to choose between playing as White, Black, or Random.
    * Default selection will be White if no choice is made.
* **Custom Board Size Selector:**
    * Located at the top right of the screen in a small box (div).
    * Two dropdown menus separated by an "x" (e.g., "8 x 8"):
        * First dropdown: Allows selection of the number of rows (6-10).
        * Second dropdown: Allows selection of the number of columns (6-10).
* **Settings Button:**
    * A "Settings" button (e.g., a gear icon) at the top right of the screen to access customization options.
* **Settings Menu:**
    * **Color Themes:** A dropdown or grid to select from 10 different visual themes affecting the board colors, website (buttons, etc.), and the font color of the pieces.
    * **Animations:** A toggle switch to turn move animations on/off (default: on).
    * **Light/Dark Mode:** A toggle switch to switch between light and dark website modes. The color themes will adapt based on this setting.
    * **Move Input Method:** A toggle switch to choose between "Double Click to Move" (default) and "Drag and Drop".
    * **Time Control:** A dropdown or radio buttons to select the time control: Blitz (3 minutes), Rapid (10 minutes), No Limit.
    * **Bot Difficulty:** A dropdown or radio buttons to select the bot difficulty: Beginner, Intermediate, Difficult, Impossible (only available for 8x8 boards).
* **Play Button:** A prominent "Play" button to start the game after selecting desired settings.
* **Game History Display:**
    * A box or panel on the side of the screen to show the move history in standard algebraic notation.
    * The history will update after each move.
* **PGN Download Button:** A button or link to download the current game history as a PGN file.
* **Resign Button:** A clearly visible "Resign" button to allow the player to forfeit the game.
* **Whose Turn Indicator:** A small box or text display indicating whose turn it is (e.g., "White to move," "Black to move").
* **Stockfish Availability Indicator:** A clear visual indication (e.g., disabled option, message) that the "Impossible" difficulty is only available for the standard 8x8 board size.
* **Move Suggestions (Future Consideration):** While not in version 1.1, a button to request a hint from the AI could be considered for later.

**5.2. Game Logic**

* **Standard Chess Rules:** The game will adhere to the standard rules of chess, including piece movement, captures, castling, and pawn promotion (except as modified for custom boards).
* **Custom Board Logic:** The game will correctly handle piece movement and board boundaries for the custom board sizes.
* **Piece Placement for Custom Boards:**
    * **6xN:** Rook, Knight, Queen, King, Knight, Rook (mirrored)
    * **7xN:** Rook, Knight, Bishop, King, Bishop, Knight, Rook (mirrored)
    * **8xN:** Standard Chess Setup
    * **9xN:** Rook, Knight, Bishop, Queen, King, Queen, Bishop, Knight, Rook (mirrored)
    * **10xN:** Rook, Knight, Bishop, Knight, Queen, King, Bishop, Knight, Bishop, Rook (mirrored)
    * The 2nd rank from the top and bottom will always be pawns.
* **Pawn Movement on Custom Boards (6xN and 7xN):** Pawns on 6xN and 7xN boards will only be able to move one square forward on their first move.
* **Castling on Custom Boards:**
    * **6x6:** The rook takes the king's starting position, and the king moves one square to the right. Queenside castling is not possible.
    * **7x7:** Standard castling rules apply.
    * **8x8:** Standard castling rules apply.
    * **9x9:** The king takes the knight's starting position, and the rook takes the bishop's starting position (those pieces must be gone before castling is possible). Queenside castling will follow the same logic if a queen exists and the path is clear.
    * **10x10:** The king takes the knight's (second from the edge) starting position, and the rook takes the bishop's (second from the edge) starting position (those pieces must be gone). Queenside castling will follow the same logic if a queen exists and the path is clear.
    * Castling will only be possible on board sizes that have a King and Rook in their initial setup.
* **Bot Opponent Logic:**
    * **Beginner:** Captures pieces and gives checks opportunistically.
    * **Intermediate:** More selective with checks, captures undefended pieces, trades pieces of equal value.
    * **Difficult:** Focuses on controlling the center, defends attacked pieces, plays strategically to win.
    * **Impossible (8x8 Only):** Uses the Stockfish API to determine the best move. If the API does not return a move within 5 seconds, the "Difficult" AI will make the move for that turn.
* **Stockfish API Integration:**
    * When the bot needs to make a move at the "Impossible" difficulty (and for 8x8 boards only), the website will:
        * Construct a GET request to `https://stockfish.online/api/s/v2.php`.
        * Include the current board state as a FEN string in the `fen` parameter.
        * Set the `depth` parameter to 10.
        * Send the request to the API.
        * Parse the JSON response from the API.
        * If `success` is true, extract the `bestmove` and execute it on the chessboard.
        * Handle potential errors if `success` is false (though the "Difficult" bot will act as a fallback after 5 seconds).
* **Turn Management:** The game will correctly track whose turn it is.
* **Game End Conditions:** The game will end upon checkmate, stalemate, or resignation.
* **Random Side Selection:** When "Random" is selected, a random number (1 or 2) will determine if the player is White (1) or Black (2). The computer will be assigned the opposite color. White always starts the game.
* **Move Input Handling:**
    * **Double Click:** The player will click on the piece they want to move, and then click on the destination square.
    * **Drag and Drop:** The player will click and hold the piece, drag it to the destination square, and release. Legal moves will be visually indicated by gray dots on the valid destination squares when a piece is picked up. For the King, if castling is possible in drag mode, an extra gray dot will appear on the castling destination square.
* **Illegal Move Feedback:** If the player attempts an illegal move, the square where they tried to place their piece will briefly highlight in red for 1 second.
* **Game End Animations:** When the game ends:
    * **Win:** A mini screen will appear with "YOU WON!" in a large, bold font, accompanied by a confetti animation falling from the top.
    * **Draw:** A mini screen will appear with "YOU DREW!" in a large, bold font, accompanied by question mark emojis falling from the top.
    * **Loss:** A mini screen will appear with "YOU LOST" in a large, bold font, accompanied by crying emojis falling from the top.
* **Rematch Functionality:** After a game ends, there will be an option to "Play Again" or "New Game". "Play Again" will start a new game with the exact same settings (board size, bot difficulty, etc.). "New Game" will take the user back to the settings options.

**5.3. Visual Design**

* **Beautiful and Engaging Themes:** The 10 color themes should be visually distinct and appealing. They will affect the board colors, website elements (buttons, backgrounds, etc.), and the font color of the chess pieces (black pieces will have a black font color, white pieces will have a contrasting font color based on the theme).
* **Light and Dark Mode Adaptation:** The themes should have distinct versions for light and dark mode, maintaining the core color palettes with adjustments for brightness and contrast.
* **Clear Piece Representation:** The Unicode characters used for pieces should be easily recognizable.
* **Intuitive Layout:** The UI elements should be logically placed and easy to understand.
* **Responsive Design (Desired):** While not explicitly requested for version 1.1, a responsive design that adapts to different screen sizes is still considered a beneficial future enhancement.

**6. Future Considerations (Out of Scope for Version 1.1)**

* Multiplayer functionality.
* Client-side move validation.
* Draw offer functionality.
* Displaying Stockfish evaluation.
* Sound effects.
* User accounts and saved game history.
* More sophisticated AI difficulty levels.
* Move suggestions or hints.

**7. Open Issues**

* Specific color palettes for the 10 themes need to be defined.
* Exact visual design of the UI elements needs to be determined.
* Responsiveness requirements need to be fully clarified for future development.

This PRD serves as an updated guide for the development of the "Custom Board Chess Online" website. It incorporates the latest decisions and provides a more detailed understanding of the required features and functionalities.