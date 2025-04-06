// Stockfish integration for chess engine
class StockfishEngine {
    constructor() {
        this.engine = null;
        this.isReady = false;
        this.initEngine();
    }

    async initEngine() {
        try {
            // Load Stockfish WASM version
            const wasmSupported = typeof WebAssembly === 'object';
            const stockfishPath = wasmSupported ? 
                'https://cdn.jsdelivr.net/npm/stockfish.wasm@0.10.0/stockfish.js' :
                'https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js';
            
            await this.loadScript(stockfishPath);
            this.engine = new Worker(stockfishPath);
            
            this.engine.onmessage = (e) => {
                if (e.data === 'uciok') {
                    this.isReady = true;
                    this.engine.postMessage('isready');
                }
            };

            this.engine.postMessage('uci');
        } catch (error) {
            console.error('Failed to initialize Stockfish:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async getBestMove(fen, depth = 15) {
        if (!this.isReady || !this.engine) {
            throw new Error('Stockfish engine not ready');
        }

        return new Promise((resolve) => {
            const listener = (e) => {
                const data = e.data;
                if (data.startsWith('bestmove')) {
                    this.engine.removeEventListener('message', listener);
                    const move = data.split(' ')[1];
                    resolve(this.parseMove(move));
                }
            };

            this.engine.addEventListener('message', listener);
            this.engine.postMessage(`position fen ${fen}`);
            this.engine.postMessage(`go depth ${depth}`);
        });
    }

    parseMove(move) {
        const fromCol = move.charCodeAt(0) - 'a'.charCodeAt(0);
        const fromRow = 8 - parseInt(move[1]);
        const toCol = move.charCodeAt(2) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(move[3]);
        
        return {
            from: [fromRow, fromCol],
            to: [toRow, toCol]
        };
    }

    quit() {
        if (this.engine) {
            this.engine.postMessage('quit');
            this.engine.terminate();
            this.engine = null;
            this.isReady = false;
        }
    }
}

export default StockfishEngine;
