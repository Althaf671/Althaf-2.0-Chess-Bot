import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

function ChessboardComponent({ position, onDrop }) {
  const [highlightedSquares, setHighlightSquares] = useState({});

  const onPieceDragBegin = (piece, sourceSquare) => {
    const tempChess = new Chess(position);
    const moves = tempChess.moves({
      square: sourceSquare,
      verbose: true,
    });

    const highlights = {};

    // Highlight legal moves
    if (moves.length > 0) {
      moves.forEach((move) => {
        highlights[move.to] = {
          backgroundColor: "rgba(0, 255, 0, 0.3)", // Green for legal move
        };
      });
      highlights[sourceSquare] = {
        backgroundColor: "rgba(255, 255, 0, 0.4)", // Yellow for selected piece
      };
    }

    // Highlight king if in check
    if (tempChess.inCheck()) {
      const kingSquare = findKingSquare(tempChess, tempChess.turn());
      if (kingSquare) {
        highlights[kingSquare] = {
          backgroundColor: "rgba(255, 0, 0, 0.4)", // Red for king in check
        };
      }
    }

    setHighlightSquares(highlights);
  };

  const onPieceDragEnd = () => {
    setHighlightSquares({});
  };

  // Helper function: Find king square based on turn
  const findKingSquare = (chess, color) => {
    const board = chess.board();
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && piece.type === "k" && piece.color === color) {
          const file = "abcdefgh"[col];
          const rank = 8 - row;
          return `${file}${rank}`;
        }
      }
    }
    return null;
  };

  return (
    <div>
      <Chessboard
        position={position}
        onPieceDrop={onDrop}
        boardWidth={700}
        animationDuration={300}
        arePiecesDraggable={true}
        boardOrientation="white"
        showBoardNotation={true}
        customSquareStyles={highlightedSquares}
        onPieceDragBegin={onPieceDragBegin}
        onPieceDragEnd={onPieceDragEnd}
      />
    </div>
  );
}

export default ChessboardComponent;