// Chess piece definitions and movement rules
class Piece {
    constructor(type, color) {
        this.type = type;
        this.color = color;
        this.hasMoved = false;
    }

    getValidMoves(board, startRow, startCol) {
        switch (this.type) {
            case 'pawn':
                return this.getPawnMoves(board, startRow, startCol);
            case 'rook':
                return this.getRookMoves(board, startRow, startCol);
            case 'knight':
                return this.getKnightMoves(board, startRow, startCol);
            case 'bishop':
                return this.getBishopMoves(board, startRow, startCol);
            case 'queen':
                return this.getQueenMoves(board, startRow, startCol);
            case 'king':
                return this.getKingMoves(board, startRow, startCol);
            default:
                return [];
        }
    }

    getPawnMoves(board, row, col) {
        const moves = [];
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? board.length - 2 : 1;

        // Forward move
        if (board[row + direction]?.[col]?.type === undefined) {
            moves.push([row + direction, col]);
            // Double move from starting position
            if (row === startRow && board[row + 2 * direction]?.[col]?.type === undefined) {
                moves.push([row + 2 * direction, col]);
            }
        }

        // Captures
        for (const captureCol of [col - 1, col + 1]) {
            if (board[row + direction]?.[captureCol]?.type !== undefined &&
                board[row + direction][captureCol].color !== this.color) {
                moves.push([row + direction, captureCol]);
            }
        }

        return moves;
    }

    getRookMoves(board, row, col) {
        const moves = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        
        for (const [dx, dy] of directions) {
            let newRow = row + dx;
            let newCol = col + dy;
            
            while (newRow >= 0 && newRow < board.length && 
                   newCol >= 0 && newCol < board[0].length) {
                if (board[newRow][newCol]?.type === undefined) {
                    moves.push([newRow, newCol]);
                } else {
                    if (board[newRow][newCol].color !== this.color) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }
                newRow += dx;
                newCol += dy;
            }
        }
        
        return moves;
    }

    getKnightMoves(board, row, col) {
        const moves = [];
        const offsets = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [dx, dy] of offsets) {
            const newRow = row + dx;
            const newCol = col + dy;
            
            if (newRow >= 0 && newRow < board.length && 
                newCol >= 0 && newCol < board[0].length) {
                if (board[newRow][newCol]?.type === undefined ||
                    board[newRow][newCol].color !== this.color) {
                    moves.push([newRow, newCol]);
                }
            }
        }

        return moves;
    }

    getBishopMoves(board, row, col) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        for (const [dx, dy] of directions) {
            let newRow = row + dx;
            let newCol = col + dy;
            
            while (newRow >= 0 && newRow < board.length && 
                   newCol >= 0 && newCol < board[0].length) {
                if (board[newRow][newCol]?.type === undefined) {
                    moves.push([newRow, newCol]);
                } else {
                    if (board[newRow][newCol].color !== this.color) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }
                newRow += dx;
                newCol += dy;
            }
        }
        
        return moves;
    }

    getQueenMoves(board, row, col) {
        return [
            ...this.getRookMoves(board, row, col),
            ...this.getBishopMoves(board, row, col)
        ];
    }

    getKingMoves(board, row, col) {
        const moves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            
            if (newRow >= 0 && newRow < board.length && 
                newCol >= 0 && newCol < board[0].length) {
                if (board[newRow][newCol]?.type === undefined ||
                    board[newRow][newCol].color !== this.color) {
                    moves.push([newRow, newCol]);
                }
            }
        }

        // Castling
        if (!this.hasMoved) {
            // Kingside castle
            if (board[row][7]?.type === 'rook' && !board[row][7].hasMoved &&
                !board[row][5]?.type && !board[row][6]?.type) {
                moves.push([row, 6]);
            }
            // Queenside castle
            if (board[row][0]?.type === 'rook' && !board[row][0].hasMoved &&
                !board[row][1]?.type && !board[row][2]?.type && !board[row][3]?.type) {
                moves.push([row, 2]);
            }
        }

        return moves;
    }
}

export default Piece;
