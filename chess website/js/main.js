// Main application entry point
import Board from './board.js';
import ChessUI from './ui.js';
import ChessBot from './bot.js';
import StockfishEngine from './stockfish.js';
import utils from './utils.js';
import Piece from './pieces.js';

class ChessGame {
    constructor() {
        this.board = null;
        this.ui = null;
        this.bot = null;
        this.stockfish = null;
        this.gameState = 'setup'; // setup, playing, ended
        this.currentPlayer = 'white';
        this.playerSide = 'white';
        this.settings = this.loadSettings();
        
        // Initialize the game without starting
        this.initGame();
        this.setupEventListeners();
        
        // Show settings modal on start
        document.getElementById('settings-modal').style.display = 'block';
    }

    loadSettings() {
        const defaultSettings = {
            boardSize: 8,
            theme: 'classic',
            animations: true,
            darkMode: false,
            moveMethod: 'drag', // or 'click'
            timeControl: 'nolimit',
            botDifficulty: 'intermediate'
        };

        const savedSettings = localStorage.getItem('chessSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('chessSettings', JSON.stringify(this.settings));
    }

    initGame() {
        // Initialize board with current settings
        this.board = new Board(this.settings.boardSize);
        this.ui = new ChessUI(this);
        this.bot = new ChessBot(this.settings.botDifficulty);
        
        if (this.settings.botDifficulty === 'impossible' && this.settings.boardSize === 8) {
            this.stockfish = new StockfishEngine();
        }

        // Apply current settings
        document.body.classList.toggle('dark-mode', this.settings.darkMode);
        document.documentElement.setAttribute('data-theme', this.settings.theme);
    }

    setupEventListeners() {
        // Settings related events
        document.getElementById('settings-btn').addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'block';
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            document.getElementById('settings-modal').style.display = 'none';
            // Start the game when closing settings
            this.startGame();
        });

        // Theme selection
        document.getElementById('theme-selector').addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            document.documentElement.setAttribute('data-theme', e.target.value);
            this.saveSettings();
        });

        // Dark mode toggle
        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            this.settings.darkMode = e.target.checked;
            document.body.classList.toggle('dark-mode', e.target.checked);
            this.saveSettings();
        });

        // Board size selection
        document.getElementById('rows-selector').addEventListener('change', (e) => {
            const newSize = parseInt(e.target.value);
            document.getElementById('cols-selector').value = newSize;
            this.settings.boardSize = newSize;
            this.saveSettings();
            this.resetGame();
        });

        // Game controls
        document.getElementById('play-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('resign-btn').addEventListener('click', () => {
            this.endGame('resign');
        });

        // Side selection
        document.querySelectorAll('input[name="side"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.playerSide = e.target.value;
                if (e.target.value === 'random') {
                    this.playerSide = Math.random() < 0.5 ? 'white' : 'black';
                }
                this.resetGame();
            });
        });

        // PGN download
        document.getElementById('pgn-download').addEventListener('click', () => {
            this.downloadPGN();
        });
    }

    async startGame() {
        // Validate settings before starting
        const boardSize = parseInt(document.getElementById('rows-selector').value);
        const botDifficulty = document.getElementById('bot-difficulty').value;
        
        // Update settings
        this.settings.boardSize = boardSize;
        this.settings.botDifficulty = botDifficulty;
        this.saveSettings();

        // Reset and start the game
        this.resetGame();
        this.gameState = 'playing';
        document.getElementById('play-btn').disabled = true;
        document.getElementById('resign-btn').disabled = false;

        // Initialize the board with current settings
        this.board = new Board(this.settings.boardSize);
        this.ui.updateBoard();

        // If playing as black, let the bot make the first move
        if (this.playerSide === 'black') {
            setTimeout(() => this.makeBotMove(), 500);
        }
    }

    async makeBotMove() {
        if (this.gameState !== 'playing') return;

        const move = await this.bot.getMove(this.board, this.currentPlayer);
        if (move) {
            this.board.movePiece(move.from[0], move.from[1], move.to[0], move.to[1]);
            this.ui.updateBoard();
            this.checkGameState();
            this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        }
    }

    checkGameState() {
        if (this.board.isCheckmate(this.currentPlayer)) {
            this.endGame('checkmate');
        } else if (this.board.isStalemate(this.currentPlayer)) {
            this.endGame('stalemate');
        }
    }

    endGame(reason) {
        this.gameState = 'ended';
        document.getElementById('play-btn').disabled = false;
        document.getElementById('resign-btn').disabled = true;

        let result;
        switch (reason) {
            case 'checkmate':
                result = this.currentPlayer === this.playerSide ? 'YOU LOST!' : 'YOU WON!';
                break;
            case 'stalemate':
                result = 'DRAW - STALEMATE';
                break;
            case 'resign':
                result = 'YOU RESIGNED';
                break;
            default:
                result = 'GAME OVER';
        }

        document.getElementById('game-result').textContent = result;
        document.getElementById('game-end-modal').style.display = 'block';
    }

    resetGame() {
        this.gameState = 'setup';
        this.currentPlayer = 'white';
        this.board = new Board(this.settings.boardSize);
        this.ui.updateBoard();
        document.getElementById('play-btn').disabled = false;
        document.getElementById('resign-btn').disabled = true;
        document.getElementById('move-history').innerHTML = '';
    }

    downloadPGN() {
        const pgn = utils.generatePGN(this.board.moveHistory, '*');
        const blob = new Blob([pgn], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chess_game.pgn';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ChessGame();
});
