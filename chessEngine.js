let board = null;
let game = new Chess();
let transpositionTable = {};  

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) {
    return false;
  }
  return piece.search(/^b/) === -1;
}


function minimax(depth, alpha, beta, maximizingPlayer) {
  const currentFen = game.fen();
  if (transpositionTable[currentFen]) {
    return transpositionTable[currentFen]; 
  }

  if (depth === 0 || game.game_over()) {
    let eval = evaluateBoard();
    transpositionTable[currentFen] = eval; 
    return eval;
  }

  let bestEval;
  if (maximizingPlayer) {
    bestEval = -Infinity;
    for (let move of game.moves()) {
      game.move(move);
      let eval = minimax(depth - 1, alpha, beta, false);
      game.undo();
      bestEval = Math.max(bestEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break;
    }
  } else {
    bestEval = Infinity;
    for (let move of game.moves()) {
      game.move(move);
      let eval = minimax(depth - 1, alpha, beta, true);
      game.undo();
      bestEval = Math.min(bestEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) break;
    }
  }

  transpositionTable[currentFen] = bestEval;  
  return bestEval;
}


function evaluateBoard() {
    const values = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 0,
    };

    const pieceSquareTables = {
        p: [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [5, 5, 5, 5, 5, 5, 5, 5],
            [1, 1, 2, 3, 3, 2, 1, 1],
            [0, 0, 1, 2, 2, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        n: [
            [-50, -40, -30, -30, -30, -30, -40, -50],
            [-40, -20, 0, 5, 5, 0, -20, -40],
            [-30, 5, 10, 15, 15, 10, 5, -30],
            [-30, 5, 15, 20, 20, 15, 5, -30],
            [-30, 5, 15, 20, 20, 15, 5, -30],
            [-30, 5, 10, 15, 15, 10, 5, -30],
            [-40, -20, 0, 5, 5, 0, -20, -40],
            [-50, -40, -30, -30, -30, -30, -40, -50]
        ],
        b: [
            [-20, -10, -10, -10, -10, -10, -10, -20],
            [-10, 0, 5, 5, 5, 5, 0, -10],
            [-10, 5, 10, 10, 10, 10, 5, -10],
            [-10, 5, 10, 10, 10, 10, 5, -10],
            [-10, 5, 10, 10, 10, 10, 5, -10],
            [-10, 5, 10, 10, 10, 10, 5, -10],
            [-10, 0, 5, 5, 5, 5, 0, -10],
            [-20, -10, -10, -10, -10, -10, -10, -20]
        ],
        r: [
            [0, 0, 0, 5, 5, 0, 0, 0],
            [0, 0, 0, 5, 5, 0, 0, 0],
            [0, 0, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 3, 3, 3, 0, 0],
            [0, 0, 0, 2, 2, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ],
        q: [
            [-20, -10, -10, -5, -5, -10, -10, -20],
            [-10, 0, 5, 5, 5, 5, 0, -10],
            [-10, 5, 10, 10, 10, 10, 5, -10],
            [-5, 5, 10, 10, 10, 10, 5, -5],
            [0, 5, 10, 10, 10, 10, 5, 0],
            [-10, 5, 10, 10, 10, 10, 5, -10],
            [-10, 0, 5, 5, 5, 5, 0, -10],
            [-20, -10, -10, -5, -5, -10, -10, -20]
        ],
        k: [
            [-30, -40, -50, -50, -50, -50, -40, -30],
            [-30, -40, -50, -50, -50, -50, -40, -30],
            [-30, -40, -50, -50, -50, -50, -40, -30],
            [-30, -40, -50, -50, -50, -50, -40, -30],
            [-20, -30, -40, -40, -40, -40, -30, -20],
            [-10, -20, -30, -30, -30, -30, -20, -10],
            [0, -10, -20, -20, -20, -20, -10, 0],
            [20, 20, 0, 0, 0, 0, 20, 20]
        ]
    };
    

    let score = 0;
    const fen = game.fen().split(" ")[0]; 

    let row = 0;
    let col = 0;

    for (let char of fen) {
        if (char === "/") {
            row++;
            col = 0;
        } else if (/[0-9]/.test(char)) {
            col += parseInt(char, 10);  
        } else {
            const pieceValue = values[char.toLowerCase()];
            let positionValue = 0;

            if (char === 'p' || char === 'P') {
                positionValue = pieceSquareTables.p[row][col];
            } else if (char === 'n' || char === 'N') {
                positionValue = pieceSquareTables.n[row][col];
            } else if (char === 'b' || char === 'B') {
                positionValue = pieceSquareTables.b[row][col];
            }
            score += char === char.toLowerCase() ? -(pieceValue + positionValue) : (pieceValue + positionValue);
            col++;
        }
    }


    return score;
}

  

function makeBestMove() {
    let bestMove = null;
    let bestValue = -Infinity;
    
    for (let depth = 1; depth <= 10; depth++) {
      for (let move of game.moves()) {
        game.move(move);
        let boardValue = minimax(depth, -Infinity, Infinity, false);
        console
        game.undo();
        if (boardValue > bestValue) {
          bestValue = boardValue;
          bestMove = move;
        }
      }
    }
    game.move(bestMove);
  }
  

function onDrop(source, target) {
  let move = game.move({
    from: source,
    to: target,
    promotion: "q", // always promote to queen
  });

  // No legal move
  if (move === null) {
    return "snapback";
  }

  makeBestMove(); // engines turn
}

function onSnapEnd() {
  board.position(game.fen());
}

let config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};
board = Chessboard("board", config);
