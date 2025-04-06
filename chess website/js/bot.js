// Chess bot implementation
class ChessBot {
    constructor(difficulty = 'intermediate') {
        this.difficulty = difficulty;
        this.maxDepth = this.getDepthByDifficulty();
    }

    getDepthByDifficulty() {
        switch (this.difficulty) {
            case 'beginner': return 2;
            case 'intermediate': return 3;
            case 'difficult': return 4;
            case 'impossible': return 5;
            default: return 3;
        }
    }

    async getMove(board, color) {
        if (this.difficulty === 'impossible' && board.size === 8) {
            // Use Stockfish for impossible difficulty on 8x8 boards
            return this.getStockfishMove(board);
        }

        const move = this.findBestMove(board, color);
        return move;
    }

    findBestMove(board, color) {
        let bestMove = null;
        let bestScore = color === 'white' ? -Infinity : Infinity;
        
        for (let row = 0; row < board.size; row++) {
            for (let col = 0; col < board.size; col++) {
                const piece = board.getPiece(row, col);
                if (piece && piece.color === color) {
                    const moves = piece.getValidMoves(board.board, row, col);
                    
                    for (const [toRow, toCol] of moves) {
                        // Try move
                        const originalPiece = board.board[toRow][toCol];
                        board.board[toRow][toCol] = piece;
                        board.board[row][col] = null;

                        const score = this.minimax(
                            board,
                            this.maxDepth - 1,
                            color === 'white' ? 'black' : 'white',
                            -Infinity,
                            Infinity
                        );

                        // Undo move
                        board.board[row][col] = piece;
                        board.board[toRow][toCol] = originalPiece;

                        if ((color === 'white' && score > bestScore) ||
                            (color === 'black' && score < bestScore)) {
                            bestScore = score;
                            bestMove = { from: [row, col], to: [toRow, toCol] };
                        }
                    }
                }
            }
        }

        return bestMove;
    }

    minimax(board, depth, color, alpha, beta) {
        if (depth === 0) {
            return this.evaluatePosition(board);
        }

        const moves = this.getAllMoves(board, color);
        
        if (color === 'white') {
            let maxScore = -Infinity;
            for (const move of moves) {
                const { from, to, piece } = move;
                
                // Try move
                const originalPiece = board.board[to[0]][to[1]];
                board.board[to[0]][to[1]] = piece;
                board.board[from[0]][from[1]] = null;

                const score = this.minimax(board, depth - 1, 'black', alpha, beta);

                // Undo move
                board.board[from[0]][from[1]] = piece;
                board.board[to[0]][to[1]] = originalPiece;

                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const move of moves) {
                const { from, to, piece } = move;
                
                // Try move
                const originalPiece = board.board[to[0]][to[1]];
                board.board[to[0]][to[1]] = piece;
                board.board[from[0]][from[1]] = null;

                const score = this.minimax(board, depth - 1, 'white', alpha, beta);

                // Undo move
                board.board[from[0]][from[1]] = piece;
                board.board[to[0]][to[1]] = originalPiece;

                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
            return minScore;
        }
    }

    getAllMoves(board, color) {
        const moves = [];
        for (let row = 0; row < board.size; row++) {
            for (let col = 0; col < board.size; col++) {
                const piece = board.getPiece(row, col);
                if (piece && piece.color === color) {
                    const validMoves = piece.getValidMoves(board.board, row, col);
                    for (const [toRow, toCol] of validMoves) {
                        moves.push({
                            from: [row, col],
                            to: [toRow, toCol],
                            piece: piece
                        });
                    }
                }
            }
        }
        return moves;
    }

    evaluatePosition(board) {
        const pieceValues = {
            'pawn': 1,
            'knight': 3,
            'bishop': 3,
            'rook': 5,
            'queen': 9,
            'king': 0
        };

        let score = 0;
        for (let row = 0; row < board.size; row++) {
            for (let col = 0; col < board.size; col++) {
                const piece = board.getPiece(row, col);
                if (piece) {
                    const value = pieceValues[piece.type];
                    score += piece.color === 'white' ? value : -value;
                }
            }
        }
        return score;
    }

    async getStockfishMove(board) {
        // This will be implemented when we add Stockfish integration
        return null;
    }
}

export default ChessBot;
