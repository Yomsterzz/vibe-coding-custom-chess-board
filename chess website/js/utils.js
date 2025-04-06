// Utility functions for the chess game
const utils = {
    // Convert chess notation to board coordinates
    notationToCoords(notation) {
        const col = notation.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = 8 - parseInt(notation[1]);
        return { row, col };
    },

    // Convert board coordinates to chess notation
    coordsToNotation(row, col, boardSize = 8) {
        const letter = String.fromCharCode('a'.charCodeAt(0) + col);
        const number = boardSize - row;
        return `${letter}${number}`;
    },

    // Check if coordinates are within board bounds
    isInBounds(row, col, boardSize) {
        return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
    },

    // Format move for display in move history
    formatMove(piece, from, to, capture = false, check = false, mate = false) {
        const pieceSymbol = piece.type === 'pawn' ? '' : piece.type[0].toUpperCase();
        const captureSymbol = capture ? 'x' : '';
        const checkSymbol = mate ? '#' : (check ? '+' : '');
        return `${pieceSymbol}${from}${captureSymbol}${to}${checkSymbol}`;
    },

    // Generate PGN (Portable Game Notation) for the game
    generatePGN(moves, result) {
        const date = new Date().toISOString().split('T')[0];
        const header = [
            '[Event "Custom Board Chess Game"]',
            '[Site "Chess Website"]',
            `[Date "${date}"]`,
            '[Round "1"]',
            '[White "Player"]',
            '[Black "Computer"]',
            `[Result "${result}"]`,
            ''
        ].join('\n');

        const moveText = moves.map((move, i) => {
            if (i % 2 === 0) {
                return `${Math.floor(i/2 + 1)}. ${move}`;
            }
            return move;
        }).join(' ');

        return `${header}${moveText} ${result}`;
    }
};

export default utils;
