// Chess UI handling
class ChessUI {
    constructor(game) {
        this.game = game;
        this.selectedPiece = null;
        this.board = document.getElementById('chessboard');
        this.initializeUI();
    }

    initializeUI() {
        this.renderBoard();
        this.setupEventListeners();
        this.setupSquareListeners();
    }

    setupSquareListeners() {
        const squares = this.board.children;
        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            const row = Math.floor(i / this.game.board.size);
            const col = i % this.game.board.size;
            
            // Remove old listener if any
            const newSquare = square.cloneNode(true);
            square.parentNode.replaceChild(newSquare, square);
            
            // Add new click listener
            newSquare.addEventListener('click', () => this.handleSquareClick(row, col));
        }
    }

    renderBoard() {
        // Clear the board
        this.board.innerHTML = '';
        
        // Set the grid size based on the board size
        this.board.style.gridTemplateColumns = `repeat(${this.game.board.size}, 1fr)`;

        // Create squares
        for (let row = 0; row < this.game.board.size; row++) {
            for (let col = 0; col < this.game.board.size; col++) {
                const square = document.createElement('div');
                square.className = 'square';
                if ((row + col) % 2 === 1) {
                    square.classList.add('dark');
                }

                // Add coordinates
                const file = String.fromCharCode('a'.charCodeAt(0) + col);
                const rank = this.game.board.size - row;
                square.setAttribute('data-square', `${file}${rank}`);

                // Add piece if present
                const piece = this.game.board.getPiece(row, col);
                if (piece) {
                    const pieceDiv = document.createElement('div');
                    pieceDiv.className = `piece ${piece.color} ${piece.type}`;
                    pieceDiv.textContent = this.getPieceUnicode(piece);
                    square.appendChild(pieceDiv);
                }

                // Add click handler
                square.addEventListener('click', () => this.handleSquareClick(row, col));
                this.board.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        // Only allow moves if the game has started
        if (this.game.gameState !== 'playing') {
            return;
        }

        const piece = this.game.board.getPiece(row, col);

        // If no piece is selected and clicked on a piece
        if (!this.selectedPiece && piece && piece.color === this.game.currentPlayer) {
            this.selectedPiece = { row, col };
            this.highlightValidMoves(piece, row, col);
            return;
        }

        // If a piece is selected
        if (this.selectedPiece) {
            const fromRow = this.selectedPiece.row;
            const fromCol = this.selectedPiece.col;

            // Try to make the move
            if (this.game.board.movePiece(fromRow, fromCol, row, col)) {
                // Animate the piece movement
                const fromSquare = this.board.children[fromRow * this.game.board.size + fromCol];
                const toSquare = this.board.children[row * this.game.board.size + col];
                const piece = fromSquare.querySelector('.piece');
                
                // Calculate the movement distance
                const rect1 = fromSquare.getBoundingClientRect();
                const rect2 = toSquare.getBoundingClientRect();
                const moveX = rect2.left - rect1.left;
                const moveY = rect2.top - rect1.top;

                // Apply the animation
                piece.style.transition = 'transform 0.3s';
                piece.style.transform = `translate(${moveX}px, ${moveY}px)`;

                // After animation, update the board
                setTimeout(() => {
                    this.updateBoard();
                    this.game.currentPlayer = this.game.currentPlayer === 'white' ? 'black' : 'white';
                    // If playing against bot and it's bot's turn
                    if (this.game.gameState === 'playing' && 
                        this.game.currentPlayer !== this.game.playerSide) {
                        setTimeout(() => this.game.makeBotMove(), 500);
                    }
                }, 300);
            }

            // Clear selection and highlights
            this.clearSelection();
            return;
        }
    }

    highlightValidMoves(piece, row, col) {
        // Add selected class to the clicked square
        const squares = this.board.getElementsByClassName('square');
        squares[row * this.game.board.size + col].classList.add('selected');

        // Highlight valid moves
        const validMoves = piece.getValidMoves(this.game.board.board, row, col);
        for (const [moveRow, moveCol] of validMoves) {
            squares[moveRow * this.game.board.size + moveCol].classList.add('valid-move');
        }
    }

    clearSelection() {
        this.selectedPiece = null;
        const squares = this.board.getElementsByClassName('square');
        for (const square of squares) {
            square.classList.remove('selected', 'valid-move');
        }
    }

    updateTurnIndicator() {
        const indicator = document.querySelector('.turn-indicator p');
        indicator.textContent = `${this.game.currentPlayer.charAt(0).toUpperCase() + 
                                this.game.currentPlayer.slice(1)} to move`;
    }

    updateMoveHistory() {
        const history = document.getElementById('move-history');
        const moves = this.game.board.moveHistory;
        
        history.innerHTML = moves.map((move, i) => {
            if (i % 2 === 0) {
                return `<div class="move">${Math.floor(i/2 + 1)}. ${move}`;
            }
            return ` ${move}</div>`;
        }).join('');
        
        history.scrollTop = history.scrollHeight;
    }

    setupEventListeners() {
        // Add event listeners for game controls
        document.getElementById('play-btn').addEventListener('click', () => {
            this.game.startGame();
        });

        document.getElementById('resign-btn').addEventListener('click', () => {
            this.game.endGame('resign');
        });

        // Add event listeners for board size selection
        document.getElementById('rows-selector').addEventListener('change', (e) => {
            const newSize = parseInt(e.target.value);
            document.getElementById('cols-selector').value = newSize;
            this.game.settings.boardSize = newSize;
            this.game.resetGame();
        });
    }

    getPieceUnicode(piece) {
        const pieces = {
            white: {
                king: '♔',    // U+2654
                queen: '♕',   // U+2655
                rook: '♖',    // U+2656
                bishop: '♗',  // U+2657
                knight: '♘',  // U+2658
                pawn: '♙'     // U+2659
            },
            black: {
                king: '♚',    // U+265A
                queen: '♛',   // U+265B
                rook: '♜',    // U+265C
                bishop: '♝',  // U+265D
                knight: '♞',  // U+265E
                pawn: '♟'     // U+265F
            }
        };
        return pieces[piece.color][piece.type];
    }
}

export default ChessUI;
