var config = {
    draggable: true,
    dropOffBoard: 'snapback',
    position: 'start',
    onDrop: onDrop
}

let board = Chessboard('board', config);
var config = {
    draggable: true,
    dropOffBoard: 'snapback',
    position: 'start',
    onDrop: onDrop
}

let chess = new Chess(
    board.fen(),
  );
console.log(board.fen());




function onDrop(soruce, target, piece, ){
console.log(soruce);
console.log(target);
console.log(piece);

}