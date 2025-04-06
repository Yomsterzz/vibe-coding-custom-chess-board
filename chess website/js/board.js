// Chess board management
import Piece from './pieces.js';
import utils from './utils.js';

class Board {
    constructor(size = 8) {
        this.size = size;
        this.board = this.createBoard();
        this.selectedPiece = null;
        this.validMoves = [];
        this.moveHistory = [];
    }

    createBoard() {
        const board = Array(this.size).fill().map(() => Array(this.size).fill(null));
        this.setupPieces(board);
        return board;
    }

    setupPieces(board) {
        // Setup pawns
        for (let col = 0; col < this.size; col++) {
            board[1][col] = new Piece('pawn', 'black');
            board[this.size - 2][col] = new Piece('pawn', 'white');
        }

        // Setup other pieces
        const pieceOrder = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        for (let col = 0; col < this.size; col++) {
            if (col < pieceOrder.length) {
                board[0][col] = new Piece(pieceOrder[col], 'black');
                board[this.size - 1][col] = new Piece(pieceOrder[col], 'white');
            }
        }
    }

    getPiece(row, col) {
        return this.board[row][col];
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        // Check if move is valid
        const validMoves = piece.getValidMoves(this.board, fromRow, fromCol);
        const isValidMove = validMoves.some(([row, col]) => row === toRow && col === toCol);
        if (!isValidMove) return false;

        // Handle castling
        if (piece.type === 'king' && Math.abs(toCol - fromCol) === 2) {
            const isKingside = toCol > fromCol;
            const rookFromCol = isKingside ? this.size - 1 : 0;
            const rookToCol = isKingside ? toCol - 1 : toCol + 1;
            
            // Move rook
            this.board[toRow][rookToCol] = this.board[fromRow][rookFromCol];
            this.board[fromRow][rookFromCol] = null;
            this.board[toRow][rookToCol].hasMoved = true;
        }

        // Record move in history
        const capture = this.board[toRow][toCol] !== null;
        const moveNotation = utils.formatMove(
            piece,
            utils.coordsToNotation(fromRow, fromCol, this.size),
            utils.coordsToNotation(toRow, toCol, this.size),
            capture
        );
        this.moveHistory.push(moveNotation);

        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        piece.hasMoved = true;

        return true;
    }

    isCheck(color) {
        // Find king position
        let kingRow, kingCol;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const piece = this.board[row][col];
                if (piece?.type === 'king' && piece.color === color) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
        }

        // Check if any opponent piece can capture the king
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color !== color) {
                    const moves = piece.getValidMoves(this.board, row, col);
                    if (moves.some(([r, c]) => r === kingRow && c === kingCol)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    isCheckmate(color) {
        if (!this.isCheck(color)) return false;

        // Check if any piece can make a move that gets out of check
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const moves = piece.getValidMoves(this.board, row, col);
                    for (const [toRow, toCol] of moves) {
                        // Try the move
                        const originalPiece = this.board[toRow][toCol];
                        this.board[toRow][toCol] = piece;
                        this.board[row][col] = null;

                        const stillInCheck = this.isCheck(color);

                        // Undo the move
                        this.board[row][col] = piece;
                        this.board[toRow][toCol] = originalPiece;

                        if (!stillInCheck) return false;
                    }
                }
            }
        }

        return true;
    }

    isStalemate(color) {
        if (this.isCheck(color)) return false;

        // Check if any piece can make a legal move
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === color) {
                    const moves = piece.getValidMoves(this.board, row, col);
                    if (moves.length > 0) return false;
                }
            }
        }

        return true;
    }

    clearHighlights() {
        this.selectedPiece = null;
        this.validMoves = [];
    }
}

export default Board;
