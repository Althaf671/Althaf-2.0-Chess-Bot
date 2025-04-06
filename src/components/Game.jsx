import { useState } from "react";
import { Chess } from "chess.js";
import ChessboardComponent from "./Chessboard";
import { getBestMove } from "../bot/bot";

const chess = new Chess();

function playSoundWhenMove(move) {
    
  // Sound Effects
  const movementSound = new Audio("/assets/audio/movementSound.mp3");
  const capturedSound = new Audio("/assets/audio/capturedSound.mp3");
  const checkSound = new Audio("/assets/audio/checkSound.mp3");
  const winnerSound = new Audio("/assets/audio/superIdol.mp3");
  const loserSound = new Audio("/assets/audio/loserSound.mp3");

  if (move.flags.includes("c")) {
    capturedSound.play().catch(() => {});
  } else {
    movementSound.play().catch(() => {});
  }

  if (chess.inCheck()) {
    checkSound.play().catch(() => {});
  }

  if (chess.isCheckmate()) {
    if (chess.turn() === "w") {
      loserSound.play().catch(() => {});
    } else {
      winnerSound.play().catch(() => {});
    }
  } else if (chess.isDraw()) {
    loserSound.play().catch(() => {});
  }
}

function Game() {
  const [fen, setFen] = useState(chess.fen());
  const [isThinking, setIsThinking] = useState(false);

  const handleMove = (sourceSquare, targetSquare) => {
    const move = chess.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Auto-promote to the Queen
    });

    if (move === null) return false; // Invalid move

    playSoundWhenMove(move); // Player's move sound
    setFen(chess.fen());

    if (chess.isGameOver()) return true;

    setTimeout(async () => {
      setIsThinking(true);

      const bestMoveString = await getBestMove(chess.fen());

      if (bestMoveString) {
        const from = bestMoveString.slice(0, 2);
        const to = bestMoveString.slice(2, 4);

        const botMove = chess.move({
          from,
          to,
          promotion: "q",
        });

        if (botMove !== null) {
          playSoundWhenMove(botMove); // Bot's move sound
          setFen(chess.fen());
        }
      }

      setIsThinking(false);
    }, 1300); // Delay for realism

    return true;
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-center tracking-wider text-2xl text-white">
        <span className="kashley-text">
          <span className="text-3xl">♛</span> Kashley</span>{" "} vs Althaf's Mighty Bot 2.0
      </h2>
      <ChessboardComponent position={fen} onDrop={handleMove} />
      {isThinking && (
        <div className="text-center text-yellow-300 font-bold text-lg">
          Bot berpikir . . .
        </div>
      )}
    </div>
  );
}

export default Game;