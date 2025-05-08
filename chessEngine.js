let board = null;
let game = new Chess();

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) {
    return false;
  }
  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false;
}

function minimax(depth, maximizingPlayer) {
  if (depth == 0 || game.game_over()) {
    return evaluateBoard();
  }
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let move of game.moves()) {
      game.move(move);
      let eval = minimax(depth - 1, false);
      game.undo();
      maxEval = Math.max(maxEval, eval);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of game.moves()) {
      game.move(move);
      let eval = minimax(depth - 1, true);
      game.undo();
      minEval = Math.min(minEval, eval);
    }
    return minEval;
  }
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
  let score = 0;
  const fen = game.fen().split(" ")[0];

  for (let char of fen) {
    if (/[a-z]/.test(char)) {
      score -= values[char];
    } else if (/[A-Z]/.test(char)) {
      score += values[char.toLowerCase()];
    }
  }
  return score;
}

function makeBestMove(depth = 1) {
  let bestMove = null;
  let bestValue = -Infinity;

  for (let move of game.moves()) {
    game.move(move);
    let boardValue = minimax(depth - 1, false);
    game.undo();
    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
    console.log(boardValue);
  }
  console.log(bestMove);
  game.move(bestMove);
}

function onDrop(source, target) {
  let move = game.move({
    from: source,
    to: target,
    promotion: "q", // always promote to a queen for example simplicity
  });

  // no legal moves
  if (move === null) {
    return "snapback";
  }

  makeBestMove(); // computers turn
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
